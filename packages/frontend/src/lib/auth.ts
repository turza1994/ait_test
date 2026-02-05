/**
 * Authentication Token Management
 * Backend uses HttpOnly refresh cookies, so we only manage access tokens on the client
 */

const ACCESS_TOKEN_KEY = 'access_token';

/**
 * Get stored access token from localStorage
 * Used for Authorization headers in API requests
 */
export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * Store access token in localStorage and cookie for middleware access
 * Access tokens are short-lived (15 minutes) for security
 */
export const setAccessToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  // Also set in cookie for middleware access (9 minutes = 540 seconds)
  document.cookie = `${ACCESS_TOKEN_KEY}=${token}; path=/; max-age=540; SameSite=strict; ${process.env.NODE_ENV === 'production' ? 'Secure;' : ''}`;
};

/**
 * Remove access token from localStorage and cookie
 */
export const removeAccessToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  // Also remove from cookie
  document.cookie = `${ACCESS_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=strict;`;
};

/**
 * Clear all authentication tokens
 * Note: Refresh tokens are HttpOnly cookies set by the server
 */
export const clearAllTokens = (): void => {
  removeAccessToken();
  // Note: HttpOnly refresh cookie will be cleared by server on logout
};