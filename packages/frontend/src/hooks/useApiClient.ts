'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export function useApiClient() {
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    // Handle authentication errors
    const handleAuthError = (event: CustomEvent) => {
      if (event.detail === 'unauthorized') {
        logout();
      }
    };

    window.addEventListener('auth-error', handleAuthError as EventListener);
    return () => {
      window.removeEventListener('auth-error', handleAuthError as EventListener);
    };
  }, [logout]);

  return {
    isAuthenticated,
  };
}