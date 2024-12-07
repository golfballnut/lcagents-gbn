import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const DEBUG = process.env.NODE_ENV === 'development'

function debugLog(action: string, data?: any) {
  if (!DEBUG) return
  console.log('[Middleware]', action, data)
}

function clearNextAuthCookies(request: NextRequest) {
  const response = NextResponse.next()
  const nextAuthCookies = ['authjs.csrf-token', 'authjs.callback-url', 'authjs.session-token']
  
  nextAuthCookies.forEach(cookieName => {
    if (request.cookies.has(cookieName)) {
      response.cookies.delete(cookieName)
    }
  })
  
  return response
}

export async function middleware(request: NextRequest) {
  // Clear any existing NextAuth cookies first
  const res = clearNextAuthCookies(request)

  try {
    // Initialize Supabase with cookie handling
    const supabase = createMiddlewareClient({
      req: request,
      res
    })

    // Check for authenticated user
    const { data: { user }, error } = await supabase.auth.getUser()
    
    debugLog('Auth Check', { 
      path: request.nextUrl.pathname,
      hasUser: !!user,
      cookies: request.cookies.getAll().map(c => c.name),
      error: error?.message
    })

    // Public paths - no auth required
    const publicPaths = ['/login', '/signup', '/auth/callback', '/test-pages']
    if (publicPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
      return res
    }

    // Redirect unauthenticated users to login
    if (!user) {
      debugLog('Unauthorized', { redirect: '/login' })
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Allow access to protected routes
    return res

  } catch (err) {
    debugLog('Error', err)
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public|api).*)'],
} 