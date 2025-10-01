import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../supabaseClient';

// Extend Request interface to include user
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    permissions: string[];
  };
}

// JWT Secret from environment
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is required in environment variables');
}

/**
 * Verify JWT Token and extract user information
 */
export const verifyJWT = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Access token required'
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Verify user exists in Supabase
    const { data: user, error } = await supabase
      .from('admin_users')
      .select('id, email, role, permissions, is_active')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      res.status(401).json({
        success: false,
        message: 'Invalid token or user not found'
      });
      return;
    }

    if (!user.is_active) {
      res.status(403).json({
        success: false,
        message: 'Account is deactivated'
      });
      return;
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions || []
    };

    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

/**
 * Check if user has required permissions
 */
export const requirePermissions = (permissions: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const userPermissions = req.user.permissions || [];
    const hasPermission = permissions.some(permission => 
      userPermissions.includes(permission) || userPermissions.includes('*')
    );

    if (!hasPermission) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
      return;
    }

    next();
  };
};

/**
 * Check if user has required role
 */
export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient role privileges'
      });
      return;
    }

    next();
  };
};

/**
 * Admin-only access (super admin role)
 */
export const requireAdmin = requireRole(['super_admin', 'admin']);

/**
 * Super admin only access
 */
export const requireSuperAdmin = requireRole(['super_admin']);

/**
 * Legacy middleware for backward compatibility (DEPRECATED)
 * @deprecated Use verifyJWT instead
 */
export const supabaseAdminAuth = (req: Request, res: Response, next: NextFunction): void => {
  console.warn('⚠️  supabaseAdminAuth is deprecated. Use verifyJWT for proper authentication.');
  
  // For development/testing only
  if (process.env.NODE_ENV === 'development') {
    (req as any).admin = {
      id: 'test-admin',
      email: 'admin@test.com'
    };
    next();
  } else {
    res.status(401).json({
      success: false,
      message: 'Authentication required in production'
    });
  }
};
