'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-client'

type AuthResponse = {
  session?: any;
  user?: any;
  error?: string;
  cookies?: string[];
};

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [response, setResponse] = useState<AuthResponse | null>(null)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      // 1. Attempt login
      console.log('[Login] Starting...', { email })
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      // 2. Check session
      const { data: { session } } = await supabase.auth.getSession()
      
      // 3. Store full response
      setResponse({
        session: data.session,
        user: data.user,
        cookies: document.cookie.split(';').map(c => c.trim())
      })

      console.log('[Login] Complete', { 
        hasUser: !!data.user,
        hasSession: !!session,
        cookies: document.cookie
      })

      // 4. No redirect - let's verify everything first
      
    } catch (error: any) {
      console.error('[Login] Failed:', error)
      setError(error.message)
      setResponse({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center">
      <div className="w-full max-w-sm p-6 bg-white dark:bg-black border border-black/[.08] dark:border-white/[.145] rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-6">Login Test</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded-md border border-black/[.08] dark:border-white/[.145] bg-white dark:bg-black"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded-md border border-black/[.08] dark:border-white/[.145] bg-white dark:bg-black"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-black dark:bg-white text-white dark:text-black rounded-md 
                     hover:bg-black/90 dark:hover:bg-white/90 
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Testing Login...' : 'Test Login'}
          </button>
        </form>

        {response && (
          <div className="mt-4 p-4 rounded-md bg-gray-50 dark:bg-gray-900/50 border border-black/[.08] dark:border-white/[.145]">
            <h2 className="text-sm font-medium mb-2">Auth Response:</h2>
            <pre className="text-xs overflow-auto max-h-64">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
} 