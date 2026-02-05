export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    role: string;
    createdAt: string;
  };
  accessToken: string;
}

export interface SignupResponse {
  user: {
    id: string;
    email: string;
    role: string;
    createdAt: string;
  };
  accessToken: string;
}

export interface RefreshTokenRequest {
  refreshToken?: string; // Optional since backend uses HttpOnly cookies
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface SampleItem {
  id: number;
  counter: number;
}

export interface ApiError {
  success: false;
  message: string;
  code?: string;
}