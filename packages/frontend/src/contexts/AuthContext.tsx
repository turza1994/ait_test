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
          try {
            const response = await apiClient.get<{
              id: number;
              name: string;
              email: string;
              role: string;
              createdAt: string;
            }>('/api/auth/me');
            if (response.success && response.data) {
              const user = {
                id: response.data.id,
                name: response.data.name,
                email: response.data.email,
                role: response.data.role as 'employer' | 'talent',
              };
              setState(prev => ({
                ...prev,
                user,
                accessToken,
                isAuthenticated: true,
                isLoading: false,
              }));
              return;
            }
          } catch {
            try {
              const refreshed = await apiClient.refreshAccessToken();
              if (refreshed) {
                const newAccessToken = getAccessToken();
                if (newAccessToken) {
                  const meResponse = await apiClient.get<{
                    id: number;
                    name: string;
                    email: string;
                    role: string;
                    createdAt: string;
                  }>('/api/auth/me');
                  if (meResponse.success && meResponse.data) {
                    const user = {
                      id: meResponse.data.id,
                      name: meResponse.data.name,
                      email: meResponse.data.email,
                      role: meResponse.data.role as 'employer' | 'talent',
                    };
                    setState(prev => ({
                      ...prev,
                      user,
                      accessToken: newAccessToken,
                      isAuthenticated: true,
                      isLoading: false,
                    }));
                    return;
                  }
                }
                setState(prev => ({
                  ...prev,
                  accessToken: newAccessToken,
                  isAuthenticated: true,
                  isLoading: false,
                }));
                return;
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
        setAccessToken(accessToken);
        const authUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role as 'employer' | 'talent',
        };
        setState({
          user: authUser,
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

  const setAuthData = (user: AuthContextType['user'], accessToken: string) => {
    if (!user) return;
    setAccessToken(accessToken);
    setState({
      user,
      accessToken,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    refreshToken,
    setAuthData,
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