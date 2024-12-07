"use client";

import { Suspense, useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';

function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-lg mb-4"></div>
      <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
    </div>
  );
}

function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const links = [
    { 
      name: 'Dashboard', 
      href: '/dashboard',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      name: 'Test Page', 
      href: '/test-page',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    { 
      name: 'Analytics', 
      href: '#',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    { 
      name: 'Settings', 
      href: '#',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden z-20"
          onClick={onClose}
        />
      )}
      
      <nav
        ref={sidebarRef}
        className={`fixed md:static inset-y-0 left-0 transform 
                   ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                   md:translate-x-0 transition-transform duration-200 ease-in-out
                   w-64 bg-white dark:bg-black border-r border-black/[.08] dark:border-white/[.145]
                   z-30`}
      >
        <div className="p-6 space-y-1">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`flex items-center px-2 py-2 rounded-md text-sm
                         transition-colors duration-200
                         ${pathname === link.href
                           ? 'bg-black/[.08] dark:bg-white/[.08] font-medium'
                           : 'hover:bg-black/[.05] dark:hover:bg-white/[.05]'
                         }`}
            >
              <span className="mr-3 text-black/70 dark:text-white/70">
                {link.icon}
              </span>
              {link.name}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}

function TopNav({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-20 border-b border-black/[.08] dark:border-white/[.145] bg-white/80 dark:bg-black/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="md:hidden -ml-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold">Agent Dashboard</h1>
          </div>
        </div>
      </div>
    </header>
  );
}

function MetricsPanel() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-6 rounded-lg border border-black/[.08] dark:border-white/[.145] bg-white dark:bg-black">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Records</h3>
        <p className="mt-2 text-3xl font-semibold">0</p>
      </div>
      <div className="p-6 rounded-lg border border-black/[.08] dark:border-white/[.145] bg-white dark:bg-black">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">API Calls Today</h3>
        <p className="mt-2 text-3xl font-semibold">0</p>
      </div>
      <div className="p-6 rounded-lg border border-black/[.08] dark:border-white/[.145] bg-white dark:bg-black">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Success Rate</h3>
        <p className="mt-2 text-3xl font-semibold">100%</p>
      </div>
    </div>
  );
}

function RecentActivity() {
  return (
    <div className="rounded-lg border border-black/[.08] dark:border-white/[.145] bg-white dark:bg-black">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <div>
              <p className="text-sm">Test record inserted successfully</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Just now</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <div>
              <p className="text-sm">API endpoint created</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">5 minutes ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <TopNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 md:ml-64">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-6">
              <Suspense fallback={<DashboardSkeleton />}>
                <MetricsPanel />
                <RecentActivity />
              </Suspense>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}