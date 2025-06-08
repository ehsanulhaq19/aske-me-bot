import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from '@/services/security';

const publicPaths = ['/login', '/chat'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value || getToken();
  const { pathname } = request.nextUrl;

  if (pathname === '/') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && pathname === 'login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|static|favicon.ico).*)'],
}; 