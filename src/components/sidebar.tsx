"use client";

import { usePathname } from 'next/navigation';
import { useRef, useEffect, ReactNode } from 'react';
import Link from 'next/link';

type NavItem = {
  name: string;
  href?: string;
  icon: ReactNode;
  children?: Array<{
    name: string;
    href: string;
    icon: ReactNode;
  }>;
};

type SidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

export function Sidebar({ isOpen = true, onClose = () => {} }: SidebarProps) {
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

  const links: NavItem[] = [
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
      name: 'Test Pages',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      children: [
        {
          name: 'Supabase',
          href: '/test-pages/supabase',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3z" />
            </svg>
          )
        },
        {
          name: 'Auth',
          href: '/test-pages/auth',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          )
        },
        {
          name: 'OpenAI',
          href: '/test-pages/openai',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          )
        },
        {
          name: 'Anthropic',
          href: '/test-pages/anthropic',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          )
        },
        {
          name: 'Netsuite',
          href: '/test-pages/netsuite',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          )
        },
        {
          name: 'Social Media',
          href: '/test-pages/social-media',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
          )
        },
      ]
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
          {links.map((item) => {
            if (item.children) {
              const isActiveParent = item.children.some(child => 
                pathname.startsWith(child.href)
              );
              
              return (
                <div key={item.name} className="space-y-1">
                  <div className={`flex items-center px-2 py-2 rounded-md text-sm font-medium
                                 ${isActiveParent ? 'bg-black/[.08] dark:bg-white/[.08]' : ''}`}>
                    <span className="mr-3 text-black/70 dark:text-white/70">
                      {item.icon}
                    </span>
                    {item.name}
                  </div>
                  <div className="ml-4 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`flex items-center px-2 py-2 rounded-md text-sm
                                  transition-colors duration-200
                                  ${pathname === child.href
                                    ? 'bg-black/[.08] dark:bg-white/[.08] font-medium'
                                    : 'hover:bg-black/[.05] dark:hover:bg-white/[.05]'
                                  }`}
                      >
                        <span className="mr-3 text-black/70 dark:text-white/70">
                          {child.icon}
                        </span>
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href!}
                className={`flex items-center px-2 py-2 rounded-md text-sm
                           transition-colors duration-200
                           ${pathname === item.href
                             ? 'bg-black/[.08] dark:bg-white/[.08] font-medium'
                             : 'hover:bg-black/[.05] dark:hover:bg-white/[.05]'
                           }`}
              >
                <span className="mr-3 text-black/70 dark:text-white/70">
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
} 