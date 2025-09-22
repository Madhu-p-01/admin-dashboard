export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  status: 'active' | 'inactive' | 'suspended';
  joinedAt: string;
  lastLogin?: string;
  createdBy?: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

export interface TeamMemberCreateRequest {
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

export interface TeamMemberUpdateRequest {
  name?: string;
  role?: string;
  permissions?: string[];
  status?: 'active' | 'inactive' | 'suspended';
}

export interface RoleCreateRequest {
  name: string;
  description?: string;
  permissions: string[];
}

export interface RoleUpdateRequest {
  name?: string;
  description?: string;
  permissions?: string[];
}

export interface AuditLogQuery {
  from?: string;
  to?: string;
  userId?: string;
  action?: string;
  resource?: string;
  page?: number;
  limit?: number;
}

export interface TeamMemberQuery {
  status?: 'active' | 'inactive' | 'suspended';
  role?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: 'name' | 'email' | 'joinedAt' | 'lastLogin';
  order?: 'asc' | 'desc';
}

// Available permissions for RBAC
export const AVAILABLE_PERMISSIONS = [
  'orders:read',
  'orders:write',
  'orders:delete',
  'products:read',
  'products:write',
  'products:delete',
  'customers:read',
  'customers:write',
  'customers:delete',
  'discounts:read',
  'discounts:write',
  'discounts:delete',
  'analytics:read',
  'analytics:export',
  'team:read',
  'team:write',
  'team:delete',
  'settings:read',
  'settings:write',
  'inventory:read',
  'inventory:write',
  'reports:read',
  'reports:export'
] as const;

export type Permission = typeof AVAILABLE_PERMISSIONS[number];

// Default roles with their permissions
export const DEFAULT_ROLES = {
  super_admin: {
    name: 'Super Admin',
    description: 'Full access to all features',
    permissions: AVAILABLE_PERMISSIONS
  },
  admin: {
    name: 'Administrator',
    description: 'Full access except team management',
    permissions: AVAILABLE_PERMISSIONS.filter(p => !p.startsWith('team:'))
  },
  manager: {
    name: 'Manager',
    description: 'Manage orders, products, and customers',
    permissions: [
      'orders:read', 'orders:write',
      'products:read', 'products:write',
      'customers:read', 'customers:write',
      'analytics:read', 'inventory:read', 'inventory:write'
    ]
  },
  support: {
    name: 'Customer Support',
    description: 'Handle customer inquiries and orders',
    permissions: [
      'orders:read', 'orders:write',
      'customers:read', 'customers:write',
      'products:read'
    ]
  },
  analyst: {
    name: 'Data Analyst',
    description: 'View analytics and reports',
    permissions: [
      'analytics:read', 'analytics:export',
      'reports:read', 'reports:export',
      'orders:read', 'products:read', 'customers:read'
    ]
  }
} as const;
