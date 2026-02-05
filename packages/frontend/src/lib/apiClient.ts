import {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  SignupRequest,
  SignupResponse,
  Job,
  Applicant,
  MatchedTalent,
  Invitation,
  TalentApplication,
} from '@/types/api';
import { getAccessToken, setAccessToken } from './auth';
import { addCSRFToHeaders, extractCSRFFromResponse } from './csrf';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Add Authorization header if access token exists
    const accessToken = getAccessToken();
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    // Add CSRF token for state-changing operations (POST, PUT, DELETE, PATCH)
    if (options.method && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(options.method.toUpperCase())) {
      addCSRFToHeaders(headers);
    }

    // Include credentials for refresh token cookies
    const config: RequestInit = {
      ...options,
      headers,
      credentials: 'include',
    };

    try {
      const response = await fetch(url, config);
      const data: ApiResponse<T> = await response.json();

      // Extract CSRF token from response headers if present
      extractCSRFFromResponse(response);

      // Handle 401 Unauthorized - attempt token refresh
      if (response.status === 401 && !endpoint.includes('/refresh-token')) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          // Retry the original request with new token
          const newAccessToken = getAccessToken();
          if (newAccessToken) {
            headers['Authorization'] = `Bearer ${newAccessToken}`;
            const retryResponse = await fetch(url, { ...config, headers });
            return retryResponse.json();
          }
        }
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async refreshAccessToken(): Promise<boolean> {
    try {
      // Use empty headers object to be enhanced with CSRF token
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Add CSRF token to headers
      addCSRFToHeaders(headers);

      const response = await fetch(`${this.baseURL}/api/auth/refresh-token`, {
        method: 'POST',
        headers,
        credentials: 'include',
        // No body needed - refresh token is in HttpOnly cookie
      });

      if (response.ok) {
        const data: ApiResponse<RefreshTokenResponse> = await response.json();
        if (data.success && data.data?.accessToken) {
          setAccessToken(data.data.accessToken);
          // Extract CSRF token if present in response
          extractCSRFFromResponse(response);
          return true;
        }
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
    return false;
  }

  // Authentication endpoints
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async signup(userData: SignupRequest): Promise<ApiResponse<SignupResponse>> {
    return this.request('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Generic GET request
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // Generic POST request
  async post<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Generic PUT request
  async put<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Generic DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Jobs (public)
  async getJobs(search?: string): Promise<ApiResponse<Job[]>> {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    return this.get<Job[]>(`/api/jobs${params}`);
  }

  async getJob(id: number): Promise<ApiResponse<Job>> {
    return this.get<Job>(`/api/jobs/${id}`);
  }

  async createJob(data: {
    title: string;
    techStack: string;
    description?: string;
    deadline: string;
    companyName: string;
  }): Promise<ApiResponse<Job>> {
    return this.post<Job>('/api/jobs', data);
  }

  async applyToJob(
    jobId: number,
    body: { source: 'manual' | 'invitation'; invitationId?: number }
  ): Promise<ApiResponse<unknown>> {
    return this.post(`/api/jobs/${jobId}/apply`, body);
  }

  // Employer
  async getEmployerJobApplicants(
    jobId: number
  ): Promise<ApiResponse<Applicant[]>> {
    return this.get<Applicant[]>(`/api/employer/jobs/${jobId}/applicants`);
  }

  async getMatchedTalents(): Promise<ApiResponse<MatchedTalent[]>> {
    return this.get<MatchedTalent[]>('/api/employer/matched-talents');
  }

  async invite(data: {
    jobId: number;
    talentId: number;
  }): Promise<ApiResponse<Invitation>> {
    return this.post<Invitation>('/api/employer/invite', data);
  }

  async getEmployerJobs(): Promise<ApiResponse<Job[]>> {
    return this.get<Job[]>('/api/employer/jobs');
  }

  // Talent
  async getTalentInvitations(): Promise<ApiResponse<Invitation[]>> {
    return this.get<Invitation[]>('/api/talent/invitations');
  }

  async getTalentApplications(): Promise<
    ApiResponse<TalentApplication[]>
  > {
    return this.get<TalentApplication[]>('/api/talent/applications');
  }

  async respondToInvitation(
    invitationId: number,
    status: 'accepted' | 'declined'
  ): Promise<ApiResponse<Invitation>> {
    return this.post<Invitation>(
      `/api/talent/invitations/${invitationId}/respond`,
      { status }
    );
  }
}

export const apiClient = new ApiClient();