import { NextRequest, NextResponse } from 'next/server';
import { AdminDatabase, PaginationOptions } from './database';
import { AdminValidator, ValidationSchema, ValidationError } from './validation';
import { AdminUser } from './auth';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: ValidationError[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiConfig {
  database: AdminDatabase;
  defaultPageSize?: number;
  maxPageSize?: number;
}

export class AdminApiHandler {
  private db: AdminDatabase;
  private defaultPageSize: number;
  private maxPageSize: number;

  constructor(config: ApiConfig) {
    this.db = config.database;
    this.defaultPageSize = config.defaultPageSize || 10;
    this.maxPageSize = config.maxPageSize || 100;
  }

  // Generic CRUD handlers
  async handleList<T>(
    req: NextRequest,
    table: string,
    options?: {
      searchFields?: string[];
      allowedSortFields?: string[];
      defaultSort?: string;
      where?: Record<string, any>;
    }
  ): Promise<NextResponse<ApiResponse<T[]>>> {
    try {
      const url = new URL(req.url);
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = Math.min(
        parseInt(url.searchParams.get('limit') || this.defaultPageSize.toString()),
        this.maxPageSize
      );
      const search = url.searchParams.get('search');
      const sortBy = url.searchParams.get('sortBy') || options?.defaultSort || 'id';
      const sortOrder = (url.searchParams.get('sortOrder') || 'DESC') as 'ASC' | 'DESC';

      // Validate sort field
      if (options?.allowedSortFields && !options.allowedSortFields.includes(sortBy)) {
        return NextResponse.json({
          success: false,
          error: `Invalid sort field: ${sortBy}`,
        }, { status: 400 });
      }

      const paginationOptions: PaginationOptions = {
        page,
        limit,
        sortBy,
        sortOrder,
      };

      let result;
      if (search && options?.searchFields) {
        result = await this.db.search<T>(table, search, options.searchFields, paginationOptions);
      } else {
        result = await this.db.findMany<T>(table, options?.where, paginationOptions);
      }

      return NextResponse.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      }, { status: 500 });
    }
  }

  async handleGet<T>(
    req: NextRequest,
    table: string,
    id: string
  ): Promise<NextResponse<ApiResponse<T>>> {
    try {
      const item = await this.db.findById<T>(table, id);
      
      if (!item) {
        return NextResponse.json({
          success: false,
          error: 'Item not found',
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: item,
      });
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      }, { status: 500 });
    }
  }

  async handleCreate<T>(
    req: NextRequest,
    table: string,
    schema: ValidationSchema,
    options?: {
      beforeCreate?: (data: any, user?: AdminUser) => Promise<any>;
      afterCreate?: (item: T, user?: AdminUser) => Promise<void>;
    }
  ): Promise<NextResponse<ApiResponse<T>>> {
    try {
      const body = await req.json();
      
      // Validate input
      const errors = AdminValidator.validate(body, schema);
      if (errors.length > 0) {
        return NextResponse.json({
          success: false,
          errors,
        }, { status: 400 });
      }

      let data = body;
      
      // Run before create hook
      if (options?.beforeCreate) {
        data = await options.beforeCreate(data, (req as any).user);
      }

      const item = await this.db.create<T>(table, data);

      // Run after create hook
      if (options?.afterCreate) {
        await options.afterCreate(item, (req as any).user);
      }

      return NextResponse.json({
        success: true,
        data: item,
      }, { status: 201 });
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      }, { status: 500 });
    }
  }

  async handleUpdate<T>(
    req: NextRequest,
    table: string,
    id: string,
    schema: ValidationSchema,
    options?: {
      beforeUpdate?: (data: any, existing: T, user?: AdminUser) => Promise<any>;
      afterUpdate?: (item: T, user?: AdminUser) => Promise<void>;
    }
  ): Promise<NextResponse<ApiResponse<T>>> {
    try {
      const body = await req.json();
      
      // Validate input
      const errors = AdminValidator.validate(body, schema);
      if (errors.length > 0) {
        return NextResponse.json({
          success: false,
          errors,
        }, { status: 400 });
      }

      // Check if item exists
      const existing = await this.db.findById<T>(table, id);
      if (!existing) {
        return NextResponse.json({
          success: false,
          error: 'Item not found',
        }, { status: 404 });
      }

      let data = body;
      
      // Run before update hook
      if (options?.beforeUpdate) {
        data = await options.beforeUpdate(data, existing, (req as any).user);
      }

      const item = await this.db.update<T>(table, id, data);
      
      if (!item) {
        return NextResponse.json({
          success: false,
          error: 'Failed to update item',
        }, { status: 500 });
      }

      // Run after update hook
      if (options?.afterUpdate) {
        await options.afterUpdate(item, (req as any).user);
      }

      return NextResponse.json({
        success: true,
        data: item,
      });
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      }, { status: 500 });
    }
  }

  async handleDelete(
    req: NextRequest,
    table: string,
    id: string,
    options?: {
      softDelete?: boolean;
      beforeDelete?: (item: any, user?: AdminUser) => Promise<void>;
      afterDelete?: (id: string, user?: AdminUser) => Promise<void>;
    }
  ): Promise<NextResponse<ApiResponse<void>>> {
    try {
      // Check if item exists
      const existing = await this.db.findById(table, id);
      if (!existing) {
        return NextResponse.json({
          success: false,
          error: 'Item not found',
        }, { status: 404 });
      }

      // Run before delete hook
      if (options?.beforeDelete) {
        await options.beforeDelete(existing, (req as any).user);
      }

      let success;
      if (options?.softDelete) {
        success = await this.db.softDelete(table, id);
      } else {
        success = await this.db.delete(table, id);
      }

      if (!success) {
        return NextResponse.json({
          success: false,
          error: 'Failed to delete item',
        }, { status: 500 });
      }

      // Run after delete hook
      if (options?.afterDelete) {
        await options.afterDelete(id, (req as any).user);
      }

      return NextResponse.json({
        success: true,
      });
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      }, { status: 500 });
    }
  }

  // Bulk operations
  async handleBulkCreate<T>(
    req: NextRequest,
    table: string,
    schema: ValidationSchema
  ): Promise<NextResponse<ApiResponse<T[]>>> {
    try {
      const body = await req.json();
      
      if (!Array.isArray(body)) {
        return NextResponse.json({
          success: false,
          error: 'Request body must be an array',
        }, { status: 400 });
      }

      // Validate all items
      const allErrors: ValidationError[] = [];
      body.forEach((item, index) => {
        const errors = AdminValidator.validate(item, schema);
        errors.forEach(error => {
          allErrors.push({
            field: `[${index}].${error.field}`,
            message: error.message,
          });
        });
      });

      if (allErrors.length > 0) {
        return NextResponse.json({
          success: false,
          errors: allErrors,
        }, { status: 400 });
      }

      const items = await this.db.bulkCreate<T>(table, body);

      return NextResponse.json({
        success: true,
        data: items,
      }, { status: 201 });
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      }, { status: 500 });
    }
  }

  async handleBulkDelete(
    req: NextRequest,
    table: string
  ): Promise<NextResponse<ApiResponse<{ deletedCount: number }>>> {
    try {
      const body = await req.json();
      const { ids } = body;

      if (!Array.isArray(ids)) {
        return NextResponse.json({
          success: false,
          error: 'ids must be an array',
        }, { status: 400 });
      }

      const deletedCount = await this.db.bulkDelete(table, ids);

      return NextResponse.json({
        success: true,
        data: { deletedCount },
      });
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      }, { status: 500 });
    }
  }
}

// Helper function to create standardized API routes
export function createCrudRoutes<T>(
  table: string,
  schema: ValidationSchema,
  config: ApiConfig,
  options?: {
    searchFields?: string[];
    allowedSortFields?: string[];
    defaultSort?: string;
    softDelete?: boolean;
    hooks?: {
      beforeCreate?: (data: any, user?: AdminUser) => Promise<any>;
      afterCreate?: (item: T, user?: AdminUser) => Promise<void>;
      beforeUpdate?: (data: any, existing: T, user?: AdminUser) => Promise<any>;
      afterUpdate?: (item: T, user?: AdminUser) => Promise<void>;
      beforeDelete?: (item: any, user?: AdminUser) => Promise<void>;
      afterDelete?: (id: string, user?: AdminUser) => Promise<void>;
    };
  }
) {
  const handler = new AdminApiHandler(config);

  return {
    async GET(req: NextRequest, context?: { params: { id: string } }) {
      if (context?.params?.id) {
        return handler.handleGet<T>(req, table, context.params.id);
      } else {
        return handler.handleList<T>(req, table, {
          searchFields: options?.searchFields,
          allowedSortFields: options?.allowedSortFields,
          defaultSort: options?.defaultSort,
        });
      }
    },

    async POST(req: NextRequest) {
      return handler.handleCreate<T>(req, table, schema, {
        beforeCreate: options?.hooks?.beforeCreate,
        afterCreate: options?.hooks?.afterCreate,
      });
    },

    async PUT(req: NextRequest, context: { params: { id: string } }) {
      return handler.handleUpdate<T>(req, table, context.params.id, schema, {
        beforeUpdate: options?.hooks?.beforeUpdate,
        afterUpdate: options?.hooks?.afterUpdate,
      });
    },

    async DELETE(req: NextRequest, context: { params: { id: string } }) {
      return handler.handleDelete(req, table, context.params.id, {
        softDelete: options?.softDelete,
        beforeDelete: options?.hooks?.beforeDelete,
        afterDelete: options?.hooks?.afterDelete,
      });
    },
  };
}
