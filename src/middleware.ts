import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/about',
    '/blog',
    '/contact',
    '/hostspace',
    '/signup',
    '/login',
    '/otpmethod',
    '/resetpassword',
    '/clientdata',
    '/properties',
  ]

  // Check if the current path is public
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))

  // If it's a dashboard route, we'll let the layout handle authentication
  // This is because we need the Firebase auth state which is only available on the client
  if (pathname.startsWith('/dashboard')) {
    return NextResponse.next()
  }

  // For all other routes, allow access
  if (isPublicRoute) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
