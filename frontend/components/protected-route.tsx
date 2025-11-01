'use client';

import { useAuth } from '@/contexts/auth-context';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    console.log('[ProtectedRoute] Auth state:', { 
      user: user?.email || 'None', 
      isLoading 
    });
  }, [user, isLoading]);

  // Show loading state while checking authentication
  if (isLoading) {
    console.log('[ProtectedRoute] Showing loading state');
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user and not loading, let middleware handle the redirect
  // This prevents double redirects and race conditions
  if (!user && !isLoading) {
    console.log('[ProtectedRoute] No user, showing redirecting state');
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Only render children if user is authenticated
  console.log('[ProtectedRoute] Rendering protected content for:', user?.email);
  return user ? <>{children}</> : null;
}