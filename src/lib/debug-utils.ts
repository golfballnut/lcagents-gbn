const DEBUG = process.env.NODE_ENV === 'development';

export function debugLog(action: string, data?: any, error?: any) {
  if (!DEBUG) return;

  console.group(`�� Debug: ${action}`);
  if (data) console.log('Data:', data);
  if (error) console.error('Error:', error);
  console.groupEnd();
}

export function debugAuth(action: string, data?: any) {
  if (!DEBUG) return;

  console.group(`🔐 Auth: ${action}`);
  console.log('Timestamp:', new Date().toISOString());
  if (data) console.log('Data:', data);
  console.groupEnd();
}

export function debugSession(session: any) {
  if (!DEBUG) return;

  console.group('📍 Session Status');
  console.log('Has Session:', !!session);
  if (session) {
    console.log('User ID:', session.user?.id);
    console.log('Email:', session.user?.email);
    console.log('Last Sign In:', session.user?.last_sign_in_at);
  }
  console.groupEnd();
} 