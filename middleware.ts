import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/candidate')) {
    const newUrl = new URL(pathname.replace('/candidate', '/job-seeker'), request.url);
    return NextResponse.redirect(newUrl);
  }

  // Always allow static files, Next.js internals, and public routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname === '/' ||
    pathname === '/sign-in' ||
    pathname === '/talent' ||
    pathname === '/courses' ||
    pathname === '/terms' ||
    pathname === '/privacy' ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|woff|woff2)$/)
  ) {
    return NextResponse.next();
  }

  // Only block truly protected routes if there is NO token at all
  const token = request.cookies.get('access_token')?.value;

  const isProtectedRoute =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/employer') ||
    pathname.startsWith('/job-seeker') ||
    pathname.startsWith('/freelancer') ||
    pathname.startsWith('/trainer');

  if (isProtectedRoute && !token) {
    const signInUrl = new URL('/sign-in', request.url);
    return NextResponse.redirect(signInUrl);
  }

  // Allow all other routes through — layout-level guards handle role enforcement
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
