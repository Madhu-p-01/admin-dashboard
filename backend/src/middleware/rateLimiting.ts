import { Request, Response, NextFunction } from 'express';

// Simple in-memory rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'); // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100');

/**
 * Rate limiting middleware
 */
export const rateLimiter = (req: Request, res: Response, next: NextFunction): void => {
  const clientId = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  
  // Clean up expired entries
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }

  // Get or create rate limit entry
  const entry = rateLimitStore.get(clientId);
  
  if (!entry) {
    // First request
    rateLimitStore.set(clientId, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS
    });
    next();
  } else if (now > entry.resetTime) {
    // Reset window
    rateLimitStore.set(clientId, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS
    });
    next();
  } else if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    // Rate limit exceeded
    const resetTime = new Date(entry.resetTime).toISOString();
    res.status(429).json({
      success: false,
      message: 'Rate limit exceeded',
      retryAfter: Math.ceil((entry.resetTime - now) / 1000),
      resetTime
    });
    return;
  } else {
    // Increment counter
    entry.count++;
    next();
  }
};

/**
 * Stricter rate limiting for sensitive operations
 */
export const strictRateLimiter = (maxRequests: number = 10, windowMs: number = 300000) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const clientId = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const key = `strict_${clientId}`;
    
    const entry = rateLimitStore.get(key);
    
    if (!entry) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      next();
    } else if (now > entry.resetTime) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      next();
    } else if (entry.count >= maxRequests) {
      res.status(429).json({
        success: false,
        message: 'Rate limit exceeded for sensitive operations',
        retryAfter: Math.ceil((entry.resetTime - now) / 1000)
      });
      return;
    } else {
      entry.count++;
      next();
    }
  };
};
