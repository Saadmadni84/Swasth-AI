// /middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'

// Define protected and auth routes
const protectedRoutes = ['/dashboard', '/profile', '/family-vault', '/health-records']
const authRoutes = ['/auth/login', '/auth/signup']
const publicRoutes = ['/', '/auth/reset-password', '/auth/update-password']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for API routes, static files, and Next.js internals
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Create a response object that we can modify
  const response = NextResponse.next()
  
  // Create a Supabase client configured to use cookies
  const supabase = createClient(request, response)
  
  // Get the session from the request cookies
  const { data: { session } } = await supabase.auth.getSession()
  
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.includes(pathname)

  console.log(`[Middleware] ${pathname} - Authenticated: ${!!session}`)

  // Redirect authenticated users away from auth pages to dashboard
  if (session && isAuthRoute) {
    const redirectUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Allow access to public routes
  if (isPublicRoute) {
    return response
  }

  // Redirect unauthenticated users from protected routes to login
  if (!session && isProtectedRoute) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // For all other cases, continue with the response
  return response
}

export const config = {
  matcher: [
    // Temporarily disable middleware to debug path issues
    // '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
