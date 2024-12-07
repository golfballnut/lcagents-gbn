'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase-client';

type DebugResponse = {
  action: string;
  data: any;
  error?: any;
  timestamp: string;
};

export default function AuthDebugPage() {
  const [logs, setLogs] = useState<DebugResponse[]>([]);
  const [loading, setLoading] = useState(false);

  async function addLog(action: string, data: any, error?: any) {
    const log: DebugResponse = {
      action,
      data,
      error,
      timestamp: new Date().toISOString()
    };
    setLogs(prev => [log, ...prev]);
  }

  async function checkEnvVars() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    addLog('Check Environment Variables', {
      url: url ? 'Defined' : 'Missing',
      key: key ? 'Defined' : 'Missing'
    });
  }

  async function checkSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      addLog('Check Current Session', data, error);
    } catch (err) {
      addLog('Check Current Session Failed', null, err);
    }
  }

  async function testConnection() {
    try {
      const { data, error } = await supabase.from('test_table').select('count');
      addLog('Test Supabase Connection', data, error);
    } catch (err) {
      addLog('Connection Test Failed', null, err);
    }
  }

  async function runAllTests() {
    setLoading(true);
    await checkEnvVars();
    await checkSession();
    await testConnection();
    setLoading(false);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Auth Debug Tools</h1>
      
      <div className="space-y-4">
        <div className="flex gap-4">
          <button
            onClick={checkEnvVars}
            disabled={loading}
            className="rounded-full border border-solid border-transparent transition-colors 
                     flex items-center justify-center bg-foreground text-background gap-2 
                     hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm h-10 px-4
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Check Env Vars
          </button>

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
            onClick={testConnection}
            disabled={loading}
            className="rounded-full border border-solid border-transparent transition-colors 
                     flex items-center justify-center bg-foreground text-background gap-2 
                     hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm h-10 px-4
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Test Connection
          </button>

          <button
            onClick={runAllTests}
            disabled={loading}
            className="rounded-full border border-solid border-transparent transition-colors 
                     flex items-center justify-center bg-foreground text-background gap-2 
                     hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm h-10 px-4
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Run All Tests
          </button>
        </div>

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