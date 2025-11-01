// This file is deprecated. Use /lib/supabaseClient.js instead for runtime-safe initialization.
// Keeping for backward compatibility.

import { cookies } from 'next/headers';
import { createSupabaseServerClient } from './supabaseClient.js';

export async function createClient() {
  const cookieStore = await cookies();
  return createSupabaseServerClient(cookieStore);
}
