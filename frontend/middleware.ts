import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of public routes that don't require authentication
const publicRoutes = ['/', '/auth/login', '/auth/register', '/auth/callback'];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Allow access to public routes without authentication
  if (publicRoutes.includes(req.nextUrl.pathname)) {
    // If user is signed in and trying to access auth pages, redirect to dashboard
    if (session && req.nextUrl.pathname.startsWith('/auth')) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/dashboard';
      return NextResponse.redirect(redirectUrl);
    }
    return res;
  }

  // For all other routes, require authentication
  if (!session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/auth/login';
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - Next.js static files (_next/static, _next/image)
     * - favicon.ico
     * - static files with extensions like png, jpg, svg, css, js, etc.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(png|jpg|jpeg|svg|gif|ico|css|js|woff2|woff|ttf|map)$).*)',
  ],
};
