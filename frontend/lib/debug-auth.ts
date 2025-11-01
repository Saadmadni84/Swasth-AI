// Debug utility for authentication issues
export function debugSupabaseConfig() {
  console.log('=== Supabase Configuration Debug ===');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing');
  
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.log('URL starts with https:', process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('https://'));
    console.log('URL ends with supabase.co:', process.env.NEXT_PUBLIC_SUPABASE_URL.includes('supabase.co'));
  }
  
  if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.log('Anon key length:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length);
    console.log('Anon key starts with eyJ:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.startsWith('eyJ'));
  }
  
  console.log('=== End Debug ===');
}

export function debugAuthAttempt(email: string, result: any) {
  console.log('=== Auth Attempt Debug ===');
  console.log('Email:', email);
  console.log('Has session:', !!result.data?.session);
  console.log('Has user:', !!result.data?.user);
  console.log('Error code:', result.error?.code);
  console.log('Error message:', result.error?.message);
  console.log('=== End Auth Debug ===');
}
