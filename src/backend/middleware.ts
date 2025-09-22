import { NextRequest, NextResponse } from 'next/server';

export interface AdminMiddlewareConfig {
  adminPath?: string;
  authRequired?: boolean;
  roles?: string[];
}

export function createAdminMiddleware(config: AdminMiddlewareConfig = {}) {
  const { adminPath = '/admin', authRequired = true, roles = ['admin'] } = config;

  return async function adminMiddleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if this is an admin route
    if (!pathname.startsWith(adminPath)) {
      return NextResponse.next();
    }

    // Skip auth for login page
    if (pathname === `${adminPath}/login`) {
      return NextResponse.next();
    }

    if (authRequired) {
      // Check for auth token
      const token = request.cookies.get('admin-token')?.value;
      
      if (!token) {
        return NextResponse.redirect(new URL(`${adminPath}/login`, request.url));
      }

      // Validate token and check roles
      try {
        const user = await validateAdminToken(token);
        if (!user || !roles.some(role => user.roles?.includes(role))) {
          return NextResponse.redirect(new URL(`${adminPath}/login`, request.url));
        }
      } catch (error) {
        return NextResponse.redirect(new URL(`${adminPath}/login`, request.url));
      }
    }

    return NextResponse.next();
  };
}

export async function validateAdminToken(token: string): Promise<any> {
  // This would typically validate against your auth service
  // For now, return a mock implementation
  try {
    // Decode JWT or validate with your auth service
    return {
      id: '1',
      email: 'admin@example.com',
      roles: ['admin']
    };
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export function corsMiddleware() {
  return function cors(request: NextRequest) {
    const response = NextResponse.next();
    
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
  };
}

export function rateLimitMiddleware(options: { windowMs?: number; max?: number } = {}) {
  const { windowMs = 15 * 60 * 1000, max = 100 } = options;
  const requests = new Map();

  return function rateLimit(request: NextRequest) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    const userRequests = requests.get(ip) || [];
    const validRequests = userRequests.filter((time: number) => time > windowStart);

    if (validRequests.length >= max) {
      return new NextResponse('Too Many Requests', { status: 429 });
    }

    validRequests.push(now);
    requests.set(ip, validRequests);

    return NextResponse.next();
  };
}
