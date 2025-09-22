import { NextRequest, NextResponse } from 'next/server';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
  createdAt: Date;
  lastLogin?: Date;
}

export interface AuthConfig {
  jwtSecret?: string;
  sessionDuration?: number;
  cookieName?: string;
}

export class AdminAuth {
  private config: AuthConfig;

  constructor(config: AuthConfig = {}) {
    this.config = {
      jwtSecret: config.jwtSecret || process.env.JWT_SECRET || 'default-secret',
      sessionDuration: config.sessionDuration || 24 * 60 * 60 * 1000, // 24 hours
      cookieName: config.cookieName || 'admin-token',
    };
  }

  async login(email: string, password: string): Promise<{ user: AdminUser; token: string } | null> {
    // This would typically validate against your database
    // For now, return a mock implementation
    if (email === 'admin@example.com' && password === 'admin123') {
      const user: AdminUser = {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        roles: ['admin', 'super_admin'],
        permissions: ['read', 'write', 'delete', 'manage_users'],
        createdAt: new Date(),
        lastLogin: new Date(),
      };

      const token = await this.generateToken(user);
      return { user, token };
    }

    return null;
  }

  async generateToken(user: AdminUser): Promise<string> {
    // This would typically use a JWT library
    // For now, return a mock token
    const payload = {
      id: user.id,
      email: user.email,
      roles: user.roles,
      exp: Date.now() + this.config.sessionDuration!,
    };

    return Buffer.from(JSON.stringify(payload)).toString('base64');
  }

  async verifyToken(token: string): Promise<AdminUser | null> {
    try {
      const payload = JSON.parse(Buffer.from(token, 'base64').toString());
      
      if (payload.exp < Date.now()) {
        return null; // Token expired
      }

      // This would typically fetch user from database
      return {
        id: payload.id,
        email: payload.email,
        name: 'Admin User',
        roles: payload.roles,
        permissions: ['read', 'write', 'delete', 'manage_users'],
        createdAt: new Date(),
        lastLogin: new Date(),
      };
    } catch (error) {
      return null;
    }
  }

  async logout(): Promise<void> {
    // This would typically invalidate the token in your database
    // For now, just return
    return;
  }

  hasPermission(user: AdminUser, permission: string): boolean {
    return user.permissions.includes(permission) || user.roles.includes('super_admin');
  }

  hasRole(user: AdminUser, role: string): boolean {
    return user.roles.includes(role);
  }

  createAuthCookie(token: string): string {
    const maxAge = this.config.sessionDuration! / 1000; // Convert to seconds
    return `${this.config.cookieName}=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}; Path=/`;
  }

  createLogoutCookie(): string {
    return `${this.config.cookieName}=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/`;
  }
}

export function withAuth(handler: (req: NextRequest, user: AdminUser) => Promise<NextResponse>) {
  return async function authHandler(req: NextRequest): Promise<NextResponse> {
    const auth = new AdminAuth();
    const token = req.cookies.get(auth['config'].cookieName!)?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await auth.verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    return handler(req, user);
  };
}

export function requirePermission(permission: string) {
  return function permissionMiddleware(handler: (req: NextRequest, user: AdminUser) => Promise<NextResponse>) {
    return withAuth(async (req: NextRequest, user: AdminUser) => {
      const auth = new AdminAuth();
      
      if (!auth.hasPermission(user, permission)) {
        return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
      }

      return handler(req, user);
    });
  };
}

export function requireRole(role: string) {
  return function roleMiddleware(handler: (req: NextRequest, user: AdminUser) => Promise<NextResponse>) {
    return withAuth(async (req: NextRequest, user: AdminUser) => {
      const auth = new AdminAuth();
      
      if (!auth.hasRole(user, role)) {
        return NextResponse.json({ error: 'Insufficient role' }, { status: 403 });
      }

      return handler(req, user);
    });
  };
}
