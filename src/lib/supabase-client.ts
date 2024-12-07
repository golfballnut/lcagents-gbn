import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: { persistSession: false }
  }
)

export async function testSupabaseConnection() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return true;
} 