// /lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'
import { createBrowserClient, createServerClient } from '@supabase/ssr'

// Runtime-safe environment variable access
function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return { supabaseUrl, supabaseAnonKey }
}

// Browser client for client-side operations
let browserClient = null

export function createSupabaseBrowserClient() {
  if (typeof window === 'undefined') {
    throw new Error('createSupabaseBrowserClient should only be called on the client side')
  }

  if (browserClient) {
    return browserClient
  }

  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig()

  browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      flowType: 'pkce',
      detectSessionInUrl: true,
      persistSession: true,
      autoRefreshToken: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  })

  return browserClient
}

// Server client for API routes and server-side operations
export function createSupabaseServerClient(cookieStore) {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name) {
        return cookieStore?.get(name)?.value
      },
      set(name, value, options) {
        try {
          cookieStore?.set({ name, value, ...options })
        } catch (error) {
          // Handle cases where cookies can't be set (e.g., static generation)
          console.warn('Could not set cookie:', name)
        }
      },
      remove(name, options) {
        try {
          cookieStore?.set({ name, value: '', ...options })
        } catch (error) {
          console.warn('Could not remove cookie:', name)
        }
      },
    },
  })
}

// Legacy client for backward compatibility (runtime-safe)
let legacyClient = null

export function getSupabaseClient() {
  if (legacyClient) {
    return legacyClient
  }

  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig()

  legacyClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: typeof window !== 'undefined',
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      autoRefreshToken: true,
      detectSessionInUrl: typeof window !== 'undefined',
      flowType: 'pkce',
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  })

  return legacyClient
}

// Configuration checker
export function isSupabaseConfigured() {
  try {
    const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig()
    return !!(supabaseUrl && supabaseAnonKey)
  } catch {
    return false
  }
}

// Export default for convenience
export default getSupabaseClient
