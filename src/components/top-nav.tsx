"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { supabase } from '@/lib/supabase-client';

export function TopNav() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { session } = useAuth();
  const router = useRouter();

  async function handleSignOut() {
    try {
      await supabase.auth.signOut();
      router.push('/login');
      router.refresh(); // Refresh server components
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }

  return (
    <header className="sticky top-0 z-20 border-b border-black/[.08] dark:border-white/[.145] bg-white/80 dark:bg-black/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden -ml-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold">Agent Dashboard</h1>
          </div>

          {session && (
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-gray-500 dark:text-gray-400">Signed in as </span>
                <span className="font-medium">{session.user.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="text-sm px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 
                         hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 