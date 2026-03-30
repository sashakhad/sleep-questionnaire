import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  // Protect authenticated app routes (not /admin/login)
  if (
    (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) ||
    request.nextUrl.pathname.startsWith('/tuning')
  ) {
    const session = await getSessionFromRequest(request);

    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Protect API routes under /api/responses and /api/tuning
  if (
    (request.nextUrl.pathname.startsWith('/api/responses') && request.method !== 'POST') ||
    request.nextUrl.pathname.startsWith('/api/tuning')
  ) {
    const session = await getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/tuning/:path*', '/api/responses/:path*', '/api/tuning/:path*'],
};
