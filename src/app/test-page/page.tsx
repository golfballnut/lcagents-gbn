"use client";

import { useState } from 'react';

type TestRecord = {
  id: number;
  created_at: string;
  company: string;
  company_url?: string;
  competitors?: string;
  prestige?: string;
  mint?: string;
  near_mint?: string;
  refinished?: string;
  aaa?: string;
  practice?: string;
};

export default function TestPage() {
  const [formData, setFormData] = useState({
    company: '',
    company_url: '',
    competitors: ''
  });
  const [responseData, setResponseData] = useState<TestRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setResponseData(null);

    try {
      const res = await fetch('/api/create-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Unknown error occurred');
      }

      const data = await res.json();
      setResponseData(data);
      setFormData({ company: '', company_url: '', competitors: '' }); // Reset form
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  }

  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Test Database Insert</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="company" className="block text-sm font-medium mb-1">
              Company Name
            </label>
            <input
              id="company"
              type="text"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
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
            <label htmlFor="company_url" className="block text-sm font-medium mb-1">
              Company URL
            </label>
            <input
              id="company_url"
              type="text"
              value={formData.company_url}
              onChange={(e) => setFormData(prev => ({ ...prev, company_url: e.target.value }))}
              className="w-full p-2 rounded-md 
                        bg-white dark:bg-gray-900
                        text-gray-900 dark:text-gray-100
                        border border-black/[.08] dark:border-white/[.145]
                        focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20
                        placeholder:text-gray-500 dark:placeholder:text-gray-400"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label htmlFor="competitors" className="block text-sm font-medium mb-1">
              Competitors
            </label>
            <input
              id="competitors"
              type="text"
              value={formData.competitors}
              onChange={(e) => setFormData(prev => ({ ...prev, competitors: e.target.value }))}
              className="w-full p-2 rounded-md 
                        bg-white dark:bg-gray-900
                        text-gray-900 dark:text-gray-100
                        border border-black/[.08] dark:border-white/[.145]
                        focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20
                        placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
          </div>

          <button
            type="submit"
            className="rounded-full border border-solid border-transparent transition-colors 
                     flex items-center justify-center bg-foreground text-background gap-2 
                     hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm h-10 px-4"
          >
            Insert Record
          </button>
        </form>

        {errorMessage && (
          <div className="mt-8 p-4 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
            <strong>Error:</strong> {errorMessage}
          </div>
        )}

        {responseData && (
          <div className="mt-8 p-4 rounded-md bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
            <strong>Successfully inserted record:</strong>
            <pre className="mt-2 overflow-auto">
              {JSON.stringify(responseData, null, 2)}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
} 