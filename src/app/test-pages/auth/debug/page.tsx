'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { debugLog, debugAuth, debugSession } from '@/lib/debug-utils';
import type { Session } from '@supabase/supabase-js';

type AuthState = {
  status: 'idle' | 'loading' | 'success' | 'error';
  action?: string;
  message?: string;
  data?: any;
  error?: any;
};

export default function AuthDebugPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [state, setState] = useState<AuthState>({ status: 'idle' });

  useEffect(() => {
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      debugAuth('Auth State Change', { event: _event, session });
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function checkSession() {
    setState({ status: 'loading', action: 'check_session' });
    
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      debugSession(session);
      
      if (error) throw error;
      
      setSession(session);
      setState({ 
        status: 'success', 
        action: 'check_session',
        data: session 
      });
    } catch (error) {
      debugLog('Session Check Failed', null, error);
      setState({ 
        status: 'error', 
        action: 'check_session',
        error 
      });
    }
  }

  async function checkEnvVars() {
    setState({ status: 'loading', action: 'check_env' });
    
    const vars = {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓' : '✗',
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓' : '✗',
    };
    
    debugLog('Environment Variables', vars);
    setState({ 
      status: 'success', 
      action: 'check_env',
      data: vars 
    });
  }

  async function testConnection() {
    setState({ status: 'loading', action: 'test_connection' });
    
    try {
      const start = performance.now();
      const { data, error } = await supabase.from('test_table').select('count');
      const duration = performance.now() - start;
      
      debugLog('Connection Test', { data, duration: `${duration.toFixed(2)}ms` }, error);
      
      if (error) throw error;
      
      setState({ 
        status: 'success', 
        action: 'test_connection',
        data: { ...data, duration: `${duration.toFixed(2)}ms` }
      });
    } catch (error) {
      setState({ 
        status: 'error', 
        action: 'test_connection',
        error 
      });
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Auth Debug Tools</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Environment: {process.env.NODE_ENV}
        </p>
      </div>

      <div className="p-4 rounded-md bg-white dark:bg-black border border-black/[.08] dark:border-white/[.145]">
        <h2 className="text-lg font-medium mb-4">Session Status</h2>
        {session ? (
          <div className="space-y-2">
            <p className="text-sm">
              <strong>User ID:</strong> {session.user.id}
            </p>
            <p className="text-sm">
              <strong>Email:</strong> {session.user.email}
            </p>
            <p className="text-sm">
              <strong>Last Sign In:</strong>{' '}
              {new Date(session.user.last_sign_in_at || '').toLocaleString()}
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No active session</p>
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={checkEnvVars}
          disabled={state.status === 'loading'}
          className="rounded-full border border-solid border-transparent transition-colors 
                   flex items-center justify-center bg-foreground text-background gap-2 
                   hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm h-10 px-4
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Check Env Vars
        </button>

        <button
          onClick={checkSession}
          disabled={state.status === 'loading'}
          className="rounded-full border border-solid border-transparent transition-colors 
                   flex items-center justify-center bg-foreground text-background gap-2 
                   hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm h-10 px-4
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Check Session
        </button>

        <button
          onClick={testConnection}
          disabled={state.status === 'loading'}
          className="rounded-full border border-solid border-transparent transition-colors 
                   flex items-center justify-center bg-foreground text-background gap-2 
                   hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm h-10 px-4
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Test Connection
        </button>
      </div>

      {state.status === 'loading' && (
        <div className="p-4 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
          Running {state.action}...
        </div>
      )}

      {state.status === 'error' && (
        <div className="p-4 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
          <strong>Error during {state.action}:</strong>
          <pre className="mt-2 text-sm overflow-auto">
            {JSON.stringify(state.error, null, 2)}
          </pre>
        </div>
      )}

      {state.status === 'success' && (
        <div className="p-4 rounded-md bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
          <strong>{state.action} completed:</strong>
          <pre className="mt-2 text-sm overflow-auto">
            {JSON.stringify(state.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 