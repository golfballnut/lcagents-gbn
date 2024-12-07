'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import type { Session } from '@supabase/supabase-js';

type SessionLog = {
  action: string;
  data: any;
  error?: any;
  timestamp: string;
};

export default function SessionTestPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [logs, setLogs] = useState<SessionLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      addLog('Auth State Changed', { event: _event, session });
    });

    return () => subscription.unsubscribe();
  }, []);

  async function addLog(action: string, data: any, error?: any) {
    const log: SessionLog = {
      action,
      data,
      error,
      timestamp: new Date().toISOString()
    };
    setLogs(prev => [log, ...prev]);
  }

  async function checkSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      setSession(session);
      addLog('Check Session', { session }, error);
    } catch (err) {
      addLog('Check Session Failed', null, err);
    }
  }

  async function fetchProtectedData() {
    try {
      const { data, error } = await supabase
        .from('test_table')
        .select('*')
        .limit(1);
      
      addLog('Fetch Protected Data', data, error);
    } catch (err) {
      addLog('Fetch Protected Data Failed', null, err);
    }
  }

  async function handleSignOut() {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      addLog('Sign Out', null, error);
    } catch (err) {
      addLog('Sign Out Failed', null, err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Session Testing</h1>
      
      <div className="space-y-8">
        {/* Session Status */}
        <div className="p-4 rounded-md bg-white dark:bg-black border border-black/[.08] dark:border-white/[.145]">
          <h2 className="text-lg font-medium mb-4">Current Session</h2>
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

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={checkSession}
            disabled={loading}
            className="rounded-full border border-solid border-transparent transition-colors 
                     flex items-center justify-center bg-foreground text-background gap-2 
                     hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm h-10 px-4
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Check Session
          </button>

          <button
            onClick={fetchProtectedData}
            disabled={loading || !session}
            className="rounded-full border border-solid border-transparent transition-colors 
                     flex items-center justify-center bg-foreground text-background gap-2 
                     hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm h-10 px-4
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Test Protected Route
          </button>

          {session && (
            <button
              onClick={handleSignOut}
              disabled={loading}
              className="rounded-full border border-solid border-transparent transition-colors 
                       flex items-center justify-center bg-red-600 text-white gap-2 
                       hover:bg-red-700 text-sm h-10 px-4
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sign Out
            </button>
          )}
        </div>

        {/* Logs */}
        <div className="space-y-4">
          {logs.map((log, index) => (
            <div 
              key={index}
              className="p-4 rounded-md bg-white dark:bg-black border border-black/[.08] dark:border-white/[.145]"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium">{log.action}</span>
                <span className="text-xs text-gray-500">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
              
              {log.data && (
                <div className="mb-2">
                  <strong className="text-sm">Data:</strong>
                  <pre className="mt-1 text-sm overflow-auto">
                    {JSON.stringify(log.data, null, 2)}
                  </pre>
                </div>
              )}

              {log.error && (
                <div className="text-red-600 dark:text-red-400">
                  <strong className="text-sm">Error:</strong>
                  <pre className="mt-1 text-sm overflow-auto">
                    {JSON.stringify(log.error, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 