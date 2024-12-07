import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (code) {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
      
      console.log('[Auth Callback] Exchanging code for session')
      await supabase.auth.exchangeCodeForSession(code)
      
      // Verify session was created
      const { data: { session } } = await supabase.auth.getSession()
      console.log('[Auth Callback] Session created:', !!session)
    }

    // Redirect to dashboard after auth
    return NextResponse.redirect(new URL('/dashboard', request.url))
  } catch (error) {
    console.error('[Auth Callback] Error:', error)
    return NextResponse.redirect(new URL('/login', request.url))
  }
} 