'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase-client';

type LoginResponse = {
  session: any;
  user: any;
  error?: string;
};

export default function SupabaseLoginTest() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [responseData, setResponseData] = useState<LoginResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setResponseData(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;
      setResponseData(data);
      setFormData({ email: '', password: '' });
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Supabase Login Test</h1>
      
      <form onSubmit={handleLogin} className="space-y-4" noValidate>
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
                      focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20
                      placeholder:text-gray-500 dark:placeholder:text-gray-400"
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
                      focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20
                      placeholder:text-gray-500 dark:placeholder:text-gray-400"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-full border border-solid border-transparent transition-colors 
                   flex items-center justify-center bg-foreground text-background gap-2 
                   hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm h-10 px-4
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Testing Login...' : 'Test Login'}
        </button>
      </form>

      {errorMessage && (
        <div className="mt-8 p-4 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
          <strong>Error:</strong> {errorMessage}
        </div>
      )}

      {responseData && (
        <div className="mt-8 p-4 rounded-md bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
          <strong>Response:</strong>
          <pre className="mt-2 overflow-auto">
            {JSON.stringify(responseData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 