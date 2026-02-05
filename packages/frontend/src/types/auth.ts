export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  setAuthData: (user: User, accessToken: string) => void;
}

export type User = {
  id: number;
  name: string;
  email: string;
  role: 'employer' | 'talent';
};