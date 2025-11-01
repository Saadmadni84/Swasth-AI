'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (
    email: string,
    password: string,
    options?: { name?: string }
  ) => Promise<{ error: Error | null; data: any | null }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: Error | null; data: any | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: false,
  signUp: async () => ({ data: null, error: null }),
  signIn: async () => ({ data: null, error: null }),
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // ✅ Safer navigation function
  const safePush = (path: string | undefined) => {
    if (typeof path === 'string' && path.startsWith('/')) {
      router.push(path);
    } else {
      console.warn('⚠️ Ignored invalid navigation path:', path);
    }
  };

  const handleAuthStateChange = useCallback(
    (event: string, session: Session | null) => {
      setSession(session);
      setUser(session?.user ?? null);

      switch (event) {
        case 'SIGNED_OUT':
          safePush('/auth/login');
          break;
        case 'SIGNED_IN':
          safePush('/dashboard');
          break;
        // other events like TOKEN_REFRESHED, USER_UPDATED → no redirect
        default:
          break;
      }

      setIsLoading(false);
    },
    []
  );

  useEffect(() => {
    const getSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;

        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error fetching initial session:', error);
        setSession(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    const { data } = supabase.auth.onAuthStateChange(handleAuthStateChange);
    const subscription = data?.subscription;

    return () => {
      subscription?.unsubscribe();
    };
  }, [handleAuthStateChange]);

  const signUp = async (
    email: string,
    password: string,
    options?: { name?: string }
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: options?.name || '' },
        },
      });
      return { data, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (data?.session) {
        setSession(data.session);
        setUser(data.session.user);
      }
      return { data, error: error ?? null };
    } catch (error) {
      return { data: null, error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      safePush('/auth/login');
    } catch (error) {
      console.error('SignOut error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, session, isLoading, signUp, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
