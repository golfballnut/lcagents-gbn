'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-client'

type SignupState = {
  status: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
  data?: any;
};

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [state, setState] = useState<SignupState>({ status: 'idle' });
  const router = useRouter()

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setState({ status: 'loading' });

    try {
      console.log('Starting signup process...', { email });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            signup_time: new Date().toISOString(),
          }
        }
      });

      console.log('Signup response:', { data, error });

      if (error) throw error;

      setState({ 
        status: 'success',
        message: 'Account created successfully! Check your email to confirm.',
        data 
      });

      // Wait briefly to show success message
      setTimeout(() => {
        router.push('/login?message=Please check your email to confirm your account');
        router.refresh();
      }, 2000);

    } catch (error: any) {
      console.error('Signup error:', error);
      setState({ 
        status: 'error',
        message: error.message || 'An error occurred during sign up'
      });
    }
  }

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center">
      <div className="w-full max-w-sm p-6 bg-white dark:bg-black border border-black/[.08] dark:border-white/[.145] rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-6">Create Account</h1>
        
        {state.status === 'error' && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-md">
            {state.message}
          </div>
        )}

        {state.status === 'success' && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm rounded-md">
            {state.message}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
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
            disabled={state.status === 'loading'}
            className="w-full py-2 px-4 bg-black dark:bg-white text-white dark:text-black rounded-md 
                     hover:bg-black/90 dark:hover:bg-white/90 
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {state.status === 'loading' ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        {/* Debug Info (only in development) */}
        {process.env.NODE_ENV === 'development' && state.data && (
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-md text-xs">
            <strong>Debug Info:</strong>
            <pre className="mt-2 overflow-auto">
              {JSON.stringify(state.data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
} 