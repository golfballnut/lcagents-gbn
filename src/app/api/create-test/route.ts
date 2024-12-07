import { supabase } from '@/lib/supabase-client';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('test_table')
      .insert([body])
      .select()
      .single();

    if (error) {
      console.error('Error inserting record:', error);
      return NextResponse.json(
        { error: 'Failed to insert record' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 