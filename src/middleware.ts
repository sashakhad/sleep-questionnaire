import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const SESSION_COOKIE = 'admin_authenticated';

export function middleware(request: NextRequest) {
  // Only protect /admin routes (not /admin/login)
  if (
    request.nextUrl.pathname.startsWith('/admin') &&
    !request.nextUrl.pathname.startsWith('/admin/login')
  ) {
    const isAuthenticated = request.cookies.get(SESSION_COOKIE)?.value === 'true';

    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Protect API routes under /api/responses (except POST which is public)
  if (request.nextUrl.pathname.startsWith('/api/responses') && request.method !== 'POST') {
    const isAuthenticated = request.cookies.get(SESSION_COOKIE)?.value === 'true';

    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/responses/:path*'],
};
