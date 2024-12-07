import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClientComponentClient({
  cookieOptions: {
    domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  }
})

// Debug helper
export async function checkSupabaseConnection() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    console.log('[Supabase] Connection check:', {
      connected: !error,
      hasUser: !!user,
      error: error?.message
    })
    return !error
  } catch (err) {
    console.error('[Supabase] Connection error:', err)
    return false
  }
} 