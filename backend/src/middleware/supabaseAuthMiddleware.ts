import { Request, Response, NextFunction } from 'express';

// Simple bypass for testing 
export const supabaseAdminAuth = (req: Request, res: Response, next: NextFunction) => {
  // should implement it when we complement the auth system
  (req as any).admin = {
    id: 'test-admin',
    email: 'admin@test.com'
  };
  next();
};
