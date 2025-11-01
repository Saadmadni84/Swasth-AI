// This file is deprecated. Use /lib/supabaseClient.js instead for runtime-safe initialization.
// Keeping for backward compatibility.

import { getSupabaseClient, createSupabaseBrowserClient, isSupabaseConfigured as checkConfig } from './supabaseClient.js';

// Lazy client initialization to prevent SSR issues
let browserClientInstance: any = null;
let serverClientInstance: any = null;

// Safe browser client getter
function getSafeSupabaseClient() {
  if (typeof window !== 'undefined') {
    // Browser environment
    if (!browserClientInstance) {
      try {
        browserClientInstance = createSupabaseBrowserClient();
      } catch (error) {
        console.warn('Failed to create Supabase browser client:', error);
        return getSupabaseClient(); // fallback to server client
      }
    }
    return browserClientInstance;
  } else {
    // Server environment
    if (!serverClientInstance) {
      serverClientInstance = getSupabaseClient();
    }
    return serverClientInstance;
  }
}

// Export the safe client getter
export const supabase = getSafeSupabaseClient();
export const supabaseClient = getSupabaseClient();
export const isSupabaseConfigured = checkConfig();
