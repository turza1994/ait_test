'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '@/lib/apiClient';
import { 
  getAccessToken, 
  setAccessToken, 
  clearAllTokens
} from '@/lib/auth';
import { AuthContextType, AuthState } from '@/types/auth';

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isLoading: true,
  isAuthenticated: false,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = getAccessToken();

        if (accessToken) {
          // Verify token is still valid by making a request
          try {
            const response = await apiClient.get('/api/health');
            if (response.success) {
              setState(prev => ({
                ...prev,
                accessToken,
                isAuthenticated: true,
                isLoading: false,
              }));
              return;
            }
          } catch {
            // Token is invalid, try to refresh using apiClient
            try {
              const refreshed = await apiClient.refreshAccessToken();
              if (refreshed) {
                const newAccessToken = getAccessToken();
                if (newAccessToken) {
                  setState(prev => ({
                    ...prev,
                    accessToken: newAccessToken,
                    isAuthenticated: true,
                    isLoading: false,
                  }));
                  return;
                }
              }
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
            }
          }
        }

        // No valid tokens found
        clearAllTokens();
        setState(prev => ({
          ...prev,
          isLoading: false,
        }));
      } catch (error) {
        console.error('Auth check failed:', error);
        setState(prev => ({
          ...prev,
          isLoading: false,
        }));
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await apiClient.login({ email, password });
      
      if (response.success && response.data) {
        const { user, accessToken } = response.data;
        
        // Store access token
        setAccessToken(accessToken);
        
        // Note: Refresh token is set by server as HttpOnly cookie
        
        setState({
          user,
          accessToken,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = (): void => {
    clearAllTokens();
    setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const refreshToken = async (): Promise<void> => {
    try {
      const refreshed = await apiClient.refreshAccessToken();
      if (refreshed) {
        const newAccessToken = getAccessToken();
        if (newAccessToken) {
          setState(prev => ({
            ...prev,
            accessToken: newAccessToken,
          }));
        } else {
          throw new Error('Failed to get new access token');
        }
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      logout(); // Clear invalid tokens
      throw error;
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}