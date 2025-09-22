import { NextRequest } from 'next/server';

export interface ValidationRule {
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'email' | 'url' | 'date';
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export interface ValidationError {
  field: string;
  message: string;
}

export class AdminValidator {
  static validate(data: any, schema: ValidationSchema): ValidationError[] {
    const errors: ValidationError[] = [];

    for (const [field, rule] of Object.entries(schema)) {
      const value = data[field];
      const fieldErrors = this.validateField(field, value, rule);
      errors.push(...fieldErrors);
    }

    return errors;
  }

  private static validateField(field: string, value: any, rule: ValidationRule): ValidationError[] {
    const errors: ValidationError[] = [];

    // Required validation
    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push({ field, message: `${field} is required` });
      return errors; // Skip other validations if required field is missing
    }

    // Skip other validations if value is empty and not required
    if (value === undefined || value === null || value === '') {
      return errors;
    }

    // Type validation
    if (rule.type) {
      const typeError = this.validateType(field, value, rule.type);
      if (typeError) errors.push(typeError);
    }

    // Min/Max validation
    if (rule.min !== undefined) {
      const minError = this.validateMin(field, value, rule.min, rule.type);
      if (minError) errors.push(minError);
    }

    if (rule.max !== undefined) {
      const maxError = this.validateMax(field, value, rule.max, rule.type);
      if (maxError) errors.push(maxError);
    }

    // Pattern validation
    if (rule.pattern && typeof value === 'string') {
      if (!rule.pattern.test(value)) {
        errors.push({ field, message: `${field} format is invalid` });
      }
    }

    // Custom validation
    if (rule.custom) {
      const customResult = rule.custom(value);
      if (customResult !== true) {
        const message = typeof customResult === 'string' ? customResult : `${field} is invalid`;
        errors.push({ field, message });
      }
    }

    return errors;
  }

  private static validateType(field: string, value: any, type: string): ValidationError | null {
    switch (type) {
      case 'string':
        if (typeof value !== 'string') {
          return { field, message: `${field} must be a string` };
        }
        break;
      case 'number':
        if (typeof value !== 'number' || isNaN(value)) {
          return { field, message: `${field} must be a number` };
        }
        break;
      case 'boolean':
        if (typeof value !== 'boolean') {
          return { field, message: `${field} must be a boolean` };
        }
        break;
      case 'email':
        if (typeof value !== 'string' || !this.isValidEmail(value)) {
          return { field, message: `${field} must be a valid email` };
        }
        break;
      case 'url':
        if (typeof value !== 'string' || !this.isValidUrl(value)) {
          return { field, message: `${field} must be a valid URL` };
        }
        break;
      case 'date':
        if (!(value instanceof Date) && !this.isValidDateString(value)) {
          return { field, message: `${field} must be a valid date` };
        }
        break;
    }
    return null;
  }

  private static validateMin(field: string, value: any, min: number, type?: string): ValidationError | null {
    if (type === 'number' && typeof value === 'number') {
      if (value < min) {
        return { field, message: `${field} must be at least ${min}` };
      }
    } else if (typeof value === 'string') {
      if (value.length < min) {
        return { field, message: `${field} must be at least ${min} characters` };
      }
    }
    return null;
  }

  private static validateMax(field: string, value: any, max: number, type?: string): ValidationError | null {
    if (type === 'number' && typeof value === 'number') {
      if (value > max) {
        return { field, message: `${field} must be at most ${max}` };
      }
    } else if (typeof value === 'string') {
      if (value.length > max) {
        return { field, message: `${field} must be at most ${max} characters` };
      }
    }
    return null;
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private static isValidDateString(value: any): boolean {
    if (typeof value === 'string') {
      const date = new Date(value);
      return !isNaN(date.getTime());
    }
    return false;
  }
}

// Common validation schemas
export const commonSchemas = {
  user: {
    email: { required: true, type: 'email' as const },
    name: { required: true, type: 'string' as const, min: 2, max: 100 },
    password: { required: true, type: 'string' as const, min: 8 },
  },
  product: {
    name: { required: true, type: 'string' as const, min: 1, max: 200 },
    price: { required: true, type: 'number' as const, min: 0 },
    description: { type: 'string' as const, max: 1000 },
    category: { required: true, type: 'string' as const },
  },
  order: {
    userId: { required: true, type: 'string' as const },
    items: { required: true },
    total: { required: true, type: 'number' as const, min: 0 },
    status: { required: true, type: 'string' as const },
  },
};

// Middleware for request validation
export function validateRequest(schema: ValidationSchema) {
  return async function validationMiddleware(req: NextRequest) {
    try {
      const body = await req.json();
      const errors = AdminValidator.validate(body, schema);
      
      if (errors.length > 0) {
        return Response.json({ errors }, { status: 400 });
      }
      
      // Add validated data to request
      (req as any).validatedData = body;
      return null; // Continue to next middleware
    } catch (error) {
      return Response.json({ error: 'Invalid JSON' }, { status: 400 });
    }
  };
}

// Query parameter validation
export function validateQuery(req: NextRequest, schema: ValidationSchema): ValidationError[] {
  const url = new URL(req.url);
  const query: any = {};
  
  for (const [key, value] of url.searchParams.entries()) {
    query[key] = value;
  }
  
  return AdminValidator.validate(query, schema);
}

// File upload validation
export interface FileValidationRule {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  required?: boolean;
}

export function validateFile(file: File, rule: FileValidationRule): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (rule.required && !file) {
    errors.push({ field: 'file', message: 'File is required' });
    return errors;
  }
  
  if (!file) return errors;
  
  if (rule.maxSize && file.size > rule.maxSize) {
    errors.push({ 
      field: 'file', 
      message: `File size must be less than ${rule.maxSize / 1024 / 1024}MB` 
    });
  }
  
  if (rule.allowedTypes && !rule.allowedTypes.includes(file.type)) {
    errors.push({ 
      field: 'file', 
      message: `File type must be one of: ${rule.allowedTypes.join(', ')}` 
    });
  }
  
  return errors;
}
