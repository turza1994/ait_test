/**
 * CSRF Token Management Utilities
 * Handles CSRF token extraction and storage for secure API requests
 */

const CSRF_TOKEN_KEY = 'csrf_token';

/**
 * Get stored CSRF token from sessionStorage
 */
export const getCSRFToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(CSRF_TOKEN_KEY);
};

/**
 * Store CSRF token in sessionStorage
 */
export const setCSRFToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(CSRF_TOKEN_KEY, token);
};

/**
 * Remove CSRF token from sessionStorage
 */
export const removeCSRFToken = (): void => {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(CSRF_TOKEN_KEY);
};

/**
 * Extract CSRF token from API response headers
 * Backend sends CSRF token in 'x-csrf-token' header
 */
export const extractCSRFFromResponse = (response: Response): void => {
  const csrfHeader = response.headers.get('x-csrf-token');
  if (csrfHeader) {
    setCSRFToken(csrfHeader);
  }
};

/**
 * Add CSRF token to request headers if available
 * Used for state-changing operations like refresh token
 */
export const addCSRFToHeaders = (headers: Record<string, string>): Record<string, string> => {
  const csrfToken = getCSRFToken();
  if (csrfToken) {
    headers['X-CSRF-Token'] = csrfToken;
  }
  return headers;
};