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
  name: string;
  email: string;
  password: string;
  role: 'employer' | 'talent';
}

export interface LoginResponse {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  };
  accessToken: string;
}

export interface SignupResponse {
  user: {
    id: number;
    name: string;
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
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface Job {
  id: number;
  title: string;
  techStack: string;
  description: string;
  deadline: string;
  employerId: number;
  companyName: string;
  createdAt: string;
  applicationCount: number;
}

export interface Applicant {
  talentId: number;
  name: string;
  email: string;
  source: string;
}

export interface MatchedTalent {
  id: number;
  name: string;
  email: string;
  matchScore: number;
}

export interface Invitation {
  id: number;
  jobId: number;
  talentId: number;
  status: string;
  createdAt: string;
  title: string;
  companyName: string;
  deadline: string;
}

export interface TalentApplication {
  id: number;
  jobId: number;
  source: string;
  createdAt: string;
  title: string;
  companyName: string;
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