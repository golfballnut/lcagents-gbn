import { testLLMConnection } from '@/lib/llm';
import { testSupabaseConnection } from '@/lib/supabase-client';
import { NextResponse } from 'next/server';

type TestResult = {
  llm: string | null;
  supabase: boolean | null;
  errors: Array<{
    service: 'LLM' | 'Supabase';
    error: string;
  }>;
}

export async function GET() {
  const results: TestResult = {
    llm: null,
    supabase: null,
    errors: []
  };
  
  try {
    results.llm = await testLLMConnection();
    results.supabase = await testSupabaseConnection();
  } catch (error) {
    // Error handling...
  }
  
  return NextResponse.json(results);
} 