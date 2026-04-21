import { NextResponse, type NextRequest } from 'next/server';

import { ADMIN_COOKIE_NAME, verifyAdminSession } from '@/lib/admin-auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/admin/login' || pathname.startsWith('/api/admin/login')) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const isValid = await verifyAdminSession(token);

    if (!isValid) {
      const loginUrl = new URL('/admin/login', request.url);
      if (pathname !== '/admin') {
        loginUrl.searchParams.set('from', pathname);
      }
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
