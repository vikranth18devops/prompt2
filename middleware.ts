import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_ADMIN_PATHS = ['/admin/login'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect Admin UI & Admin API routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    if (PUBLIC_ADMIN_PATHS.includes(pathname) || pathname === '/api/auth/login') {
      return NextResponse.next();
    }

    const adminToken = req.cookies.get('admin_session')?.value;

    if (!adminToken) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
      }
      // For UI pages, redirect to login page (we handle authentication modal on /admin page)
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
