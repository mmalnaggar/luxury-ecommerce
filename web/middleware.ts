import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  })
  
  const { pathname } = request.nextUrl
  
  // Admin-only routes
  if (pathname.startsWith('/admin')) {
    if (!token || token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
  }
  
  // Brand dashboard routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/brand')) {
    if (!token || (token.role !== 'BRAND' && token.role !== 'ADMIN')) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
  }
  
  // User profile and account routes
  if (pathname.startsWith('/profile') || pathname.startsWith('/account')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
  }
  
  // Wishlist requires authentication
  if (pathname.startsWith('/wishlist')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
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
     * - auth pages (to avoid redirect loops)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|auth).*)',
  ],
} 