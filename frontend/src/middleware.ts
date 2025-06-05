import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from '@/services/security';

// List of public paths that don't require authentication
const publicPaths = ['/login'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value || getToken();
  const { pathname } = request.nextUrl;

  // Check if the path is public
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  // Redirect to login if accessing private path without token
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to dashboard if accessing public path with token
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|static|favicon.ico).*)'],
}; 