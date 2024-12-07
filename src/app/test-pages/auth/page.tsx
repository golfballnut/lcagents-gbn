'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase-client';

type AuthMethod = 'email' | 'phone';

type AuthResponse = {
  session: any;
  user: any;
  error?: string;
};

export default function AuthTesting() {
  const [method, setMethod] = useState<AuthMethod>('email');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    otp: ''
  });
  const [responseData, setResponseData] = useState<AuthResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setResponseData(null);

    try {
      const { data, error } = await supabase.auth.signUp(
        method === 'email' 
          ? {
              email: formData.email,
              password: formData.password,
            }
          : {
              phone: formData.phone,
              password: formData.password,
            }
      );

      if (error) throw error;
      setResponseData(data);
      if (method === 'phone') setShowOTP(true);
      else setFormData({ email: '', phone: '', password: '', otp: '' });
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setResponseData(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword(
        method === 'email'
          ? {
              email: formData.email,
              password: formData.password,
            }
          : {
              phone: formData.phone,
              password: formData.password,
            }
      );

      if (error) throw error;
      setResponseData(data);
      setFormData({ email: '', phone: '', password: '', otp: '' });
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOTP(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formData.phone,
        token: formData.otp,
        type: 'sms'
      });

      if (error) throw error;
      setResponseData(data);
      setShowOTP(false);
      setFormData({ email: '', phone: '', password: '', otp: '' });
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Auth Testing</h1>
      
      <div className="mb-4 flex gap-4">
        <button
          onClick={() => setMethod('email')}
          className={`px-4 py-2 rounded-md ${
            method === 'email' 
              ? 'bg-black dark:bg-white text-white dark:text-black'
              : 'bg-gray-100 dark:bg-gray-800'
          }`}
        >
          Email
        </button>
        <button
          onClick={() => setMethod('phone')}
          className={`px-4 py-2 rounded-md ${
            method === 'phone'
              ? 'bg-black dark:bg-white text-white dark:text-black'
              : 'bg-gray-100 dark:bg-gray-800'
          }`}
        >
          Phone
        </button>
      </div>

      {showOTP ? (
        <form onSubmit={handleVerifyOTP} className="space-y-4" noValidate>
          <div>
            <label htmlFor="otp" className="block text-sm font-medium mb-1">
              Enter OTP
            </label>
            <input
              id="otp"
              type="text"
              value={formData.otp}
              onChange={(e) => setFormData(prev => ({ ...prev, otp: e.target.value }))}
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
            disabled={loading}
            className="rounded-full border border-solid border-transparent transition-colors 
                     flex items-center justify-center bg-foreground text-background gap-2 
                     hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm h-10 px-4
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      ) : (
        <form className="space-y-4" noValidate>
          <div>
            <label htmlFor={method} className="block text-sm font-medium mb-1">
              {method === 'email' ? 'Email' : 'Phone Number'}
            </label>
            <input
              id={method}
              type={method === 'email' ? 'email' : 'tel'}
              value={method === 'email' ? formData.email : formData.phone}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                [method]: e.target.value 
              }))}
              className="w-full p-2 rounded-md 
                        bg-white dark:bg-gray-900
                        text-gray-900 dark:text-gray-100
                        border border-black/[.08] dark:border-white/[.145]
                        focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20"
              placeholder={method === 'email' ? 'user@example.com' : '+1234567890'}
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

          <div className="flex gap-4">
            <button
              onClick={handleSignUp}
              disabled={loading}
              className="rounded-full border border-solid border-transparent transition-colors 
                       flex items-center justify-center bg-foreground text-background gap-2 
                       hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm h-10 px-4
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Test Sign Up'}
            </button>

            <button
              onClick={handleSignIn}
              disabled={loading}
              className="rounded-full border border-solid border-transparent transition-colors 
                       flex items-center justify-center bg-foreground text-background gap-2 
                       hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm h-10 px-4
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Test Sign In'}
            </button>
          </div>
        </form>
      )}

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