export interface DatabaseConfig {
  connectionString?: string;
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
  ssl?: boolean;
}

export interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
  command: string;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export abstract class AdminDatabase {
  protected config: DatabaseConfig;

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;
  abstract query<T = any>(sql: string, params?: any[]): Promise<QueryResult<T>>;
  abstract transaction<T>(callback: (db: AdminDatabase) => Promise<T>): Promise<T>;

  // Common CRUD operations
  async findById<T>(table: string, id: string | number): Promise<T | null> {
    const result = await this.query<T>(`SELECT * FROM ${table} WHERE id = $1`, [id]);
    return result.rows[0] || null;
  }

  async findMany<T>(
    table: string, 
    where?: Record<string, any>, 
    options?: PaginationOptions
  ): Promise<PaginatedResult<T>> {
    const { page = 1, limit = 10, sortBy = 'id', sortOrder = 'DESC' } = options || {};
    const offset = (page - 1) * limit;

    let whereClause = '';
    let params: any[] = [];
    
    if (where && Object.keys(where).length > 0) {
      const conditions = Object.keys(where).map((key, index) => {
        params.push(where[key]);
        return `${key} = $${index + 1}`;
      });
      whereClause = `WHERE ${conditions.join(' AND ')}`;
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as count FROM ${table} ${whereClause}`;
    const countResult = await this.query<{ count: string }>(countQuery, params);
    const total = parseInt(countResult.rows[0].count);

    // Get paginated data
    const dataQuery = `
      SELECT * FROM ${table} 
      ${whereClause} 
      ORDER BY ${sortBy} ${sortOrder} 
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
    const dataResult = await this.query<T>(dataQuery, [...params, limit, offset]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: dataResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async create<T>(table: string, data: Partial<T>): Promise<T> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');
    const columns = keys.join(', ');

    const query = `
      INSERT INTO ${table} (${columns}) 
      VALUES (${placeholders}) 
      RETURNING *
    `;

    const result = await this.query<T>(query, values);
    return result.rows[0];
  }

  async update<T>(table: string, id: string | number, data: Partial<T>): Promise<T | null> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');

    const query = `
      UPDATE ${table} 
      SET ${setClause}, updated_at = NOW() 
      WHERE id = $${keys.length + 1} 
      RETURNING *
    `;

    const result = await this.query<T>(query, [...values, id]);
    return result.rows[0] || null;
  }

  async delete(table: string, id: string | number): Promise<boolean> {
    const query = `DELETE FROM ${table} WHERE id = $1`;
    const result = await this.query(query, [id]);
    return result.rowCount > 0;
  }

  async softDelete(table: string, id: string | number): Promise<boolean> {
    const query = `UPDATE ${table} SET deleted_at = NOW() WHERE id = $1`;
    const result = await this.query(query, [id]);
    return result.rowCount > 0;
  }

  // Search functionality
  async search<T>(
    table: string,
    searchTerm: string,
    searchFields: string[],
    options?: PaginationOptions
  ): Promise<PaginatedResult<T>> {
    const { page = 1, limit = 10, sortBy = 'id', sortOrder = 'DESC' } = options || {};
    const offset = (page - 1) * limit;

    const searchConditions = searchFields
      .map((field, index) => `${field} ILIKE $${index + 1}`)
      .join(' OR ');
    
    const searchValue = `%${searchTerm}%`;
    const searchParams = searchFields.map(() => searchValue);

    // Get total count
    const countQuery = `SELECT COUNT(*) as count FROM ${table} WHERE ${searchConditions}`;
    const countResult = await this.query<{ count: string }>(countQuery, searchParams);
    const total = parseInt(countResult.rows[0].count);

    // Get paginated data
    const dataQuery = `
      SELECT * FROM ${table} 
      WHERE ${searchConditions}
      ORDER BY ${sortBy} ${sortOrder} 
      LIMIT $${searchParams.length + 1} OFFSET $${searchParams.length + 2}
    `;
    const dataResult = await this.query<T>(dataQuery, [...searchParams, limit, offset]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: dataResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  // Bulk operations
  async bulkCreate<T>(table: string, items: Partial<T>[]): Promise<T[]> {
    if (items.length === 0) return [];

    const keys = Object.keys(items[0]);
    const columns = keys.join(', ');
    
    const valueRows = items.map((item, itemIndex) => {
      const itemValues = keys.map((key, keyIndex) => {
        const paramIndex = itemIndex * keys.length + keyIndex + 1;
        return `$${paramIndex}`;
      });
      return `(${itemValues.join(', ')})`;
    });

    const allValues = items.flatMap(item => keys.map(key => (item as any)[key]));

    const query = `
      INSERT INTO ${table} (${columns}) 
      VALUES ${valueRows.join(', ')} 
      RETURNING *
    `;

    const result = await this.query<T>(query, allValues);
    return result.rows;
  }

  async bulkUpdate<T>(table: string, updates: Array<{ id: string | number; data: Partial<T> }>): Promise<T[]> {
    const results: T[] = [];
    
    for (const update of updates) {
      const result = await this.update<T>(table, update.id, update.data);
      if (result) results.push(result);
    }
    
    return results;
  }

  async bulkDelete(table: string, ids: (string | number)[]): Promise<number> {
    if (ids.length === 0) return 0;

    const placeholders = ids.map((_, index) => `$${index + 1}`).join(', ');
    const query = `DELETE FROM ${table} WHERE id IN (${placeholders})`;
    
    const result = await this.query(query, ids);
    return result.rowCount;
  }
}

// Mock implementation for development
export class MockAdminDatabase extends AdminDatabase {
  private connected = false;
  private mockData: Map<string, any[]> = new Map();

  async connect(): Promise<void> {
    this.connected = true;
    console.log('Connected to mock database');
  }

  async disconnect(): Promise<void> {
    this.connected = false;
    console.log('Disconnected from mock database');
  }

  async query<T = any>(sql: string, params?: any[]): Promise<QueryResult<T>> {
    if (!this.connected) {
      throw new Error('Database not connected');
    }

    // Mock implementation - in real app, this would execute actual SQL
    console.log('Executing query:', sql, 'with params:', params);
    
    return {
      rows: [] as T[],
      rowCount: 0,
      command: 'SELECT',
    };
  }

  async transaction<T>(callback: (db: AdminDatabase) => Promise<T>): Promise<T> {
    // Mock transaction - in real app, this would handle actual transactions
    return callback(this);
  }
}

// Factory function to create database instance
export function createAdminDatabase(config: DatabaseConfig): AdminDatabase {
  // In a real implementation, you would return the appropriate database class
  // based on the database type (PostgreSQL, MySQL, etc.)
  return new MockAdminDatabase(config);
}
