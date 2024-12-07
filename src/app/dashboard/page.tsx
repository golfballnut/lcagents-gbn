"use client";

import { Suspense } from 'react';

function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-lg mb-4"></div>
      <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
    </div>
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
  return (
    <div className="space-y-6">
      <Suspense fallback={<DashboardSkeleton />}>
        <MetricsPanel />
        <RecentActivity />
      </Suspense>
    </div>
  );
}