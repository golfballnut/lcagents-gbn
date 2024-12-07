'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import { debugLog, debugAuth } from '@/lib/debug-utils';

type LoginState = {
  status: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
  data?: any;
  error?: any;
};

export default function LoginDebugPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [state, setState] = useState<LoginState>({ status: 'idle' });
  const router = useRouter();

  debugLog('Login Page Render', { state });

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setState({ status: 'loading' });

    try {
      debugLog('Login Attempt', { email: formData.email });

      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      debugAuth('Login Response', { data, error });

      if (error) throw error;

      setState({ 
        status: 'success',
        message: 'Login successful! Redirecting...',
        data 
      });

      // Check session immediately after login
      const { data: { session } } = await supabase.auth.getSession();
      debugAuth('Post-Login Session Check', { session });

      // Wait briefly to show success message
      setTimeout(() => {
        debugLog('Redirecting to dashboard');
        router.push('/dashboard');
        router.refresh();
      }, 2000);

    } catch (error: any) {
      debugLog('Login Error', null, error);
      setState({ 
        status: 'error',
        message: error.message || 'Login failed',
        error
      });
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Login Debug</h1>
      
      <div className="space-y-8">
        <div className="p-4 rounded-md bg-white dark:bg-black border border-black/[.08] dark:border-white/[.145]">
          <h2 className="text-lg font-medium mb-4">Current State</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(state, null, 2)}
          </pre>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full p-2 rounded-md 
                        bg-white dark:bg-gray-900
                        text-gray-900 dark:text-gray-100
                        border border-black/[.08] dark:border-white/[.145]
                        focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20"
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
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full p-2 rounded-md 
                        bg-white dark:bg-gray-900
                        text-gray-900 dark:text-gray-100
                        border border-black/[.08] dark:border-white/[.145]
                        focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20"
              required
            />
          </div>

          <button
            type="submit"
            disabled={state.status === 'loading'}
            className="rounded-full border border-solid border-transparent transition-colors 
                     flex items-center justify-center bg-foreground text-background gap-2 
                     hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm h-10 px-4
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {state.status === 'loading' ? 'Logging in...' : 'Test Login'}
          </button>
        </form>

        {state.status === 'error' && (
          <div className="p-4 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
            <strong>Error:</strong> {state.message}
            {process.env.NODE_ENV === 'development' && (
              <pre className="mt-2 text-sm overflow-auto">
                {JSON.stringify(state.error, null, 2)}
              </pre>
            )}
          </div>
        )}

        {state.status === 'success' && (
          <div className="p-4 rounded-md bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
            <strong>{state.message}</strong>
            {process.env.NODE_ENV === 'development' && (
              <pre className="mt-2 text-sm overflow-auto">
                {JSON.stringify(state.data, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 