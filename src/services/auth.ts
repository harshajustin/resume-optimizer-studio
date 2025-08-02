/**
 * Authentication API Service
 * Handles all authentication-related API calls to the backend
 */

const API_BASE_URL = 'http://localhost:8000/api/v1';

export interface User {
  id: string;
  email: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface TokenRefreshResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

class AuthAPIService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('skillmatch_access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private getTimezoneHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'X-Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getTimezoneHeaders(),
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    const data: AuthResponse = await response.json();
    
    // Store tokens
    localStorage.setItem('skillmatch_access_token', data.access_token);
    localStorage.setItem('skillmatch_refresh_token', data.refresh_token);
    localStorage.setItem('skillmatch_user', JSON.stringify(data.user));
    
    return data;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getTimezoneHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }

    const data: AuthResponse = await response.json();
    
    // Store tokens
    localStorage.setItem('skillmatch_access_token', data.access_token);
    localStorage.setItem('skillmatch_refresh_token', data.refresh_token);
    localStorage.setItem('skillmatch_user', JSON.stringify(data.user));
    
    return data;
  }

  async refreshToken(): Promise<TokenRefreshResponse> {
    const refreshToken = localStorage.getItem('skillmatch_refresh_token');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: this.getTimezoneHeaders(),
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      // If refresh fails, clear all tokens
      this.logout();
      throw new Error('Token refresh failed');
    }

    const data: TokenRefreshResponse = await response.json();
    
    // Update access token
    localStorage.setItem('skillmatch_access_token', data.access_token);
    
    return data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Try to refresh token
        try {
          await this.refreshToken();
          // Retry the request
          const retryResponse = await fetch(`${API_BASE_URL}/auth/me`, {
            method: 'GET',
            headers: this.getAuthHeaders(),
          });
          
          if (!retryResponse.ok) {
            throw new Error('Authentication failed');
          }
          
          return await retryResponse.json();
        } catch {
          this.logout();
          throw new Error('Authentication failed');
        }
      }
      throw new Error('Failed to get user information');
    }

    const user: User = await response.json();
    
    // Update stored user data
    localStorage.setItem('skillmatch_user', JSON.stringify(user));
    
    return user;
  }

  async changePassword(passwordData: ChangePasswordRequest): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(passwordData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Password change failed');
    }
  }

  async logout(): Promise<void> {
    try {
      // Call logout endpoint if token is available
      const token = localStorage.getItem('skillmatch_access_token');
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
        });
      }
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('skillmatch_access_token');
      localStorage.removeItem('skillmatch_refresh_token');
      localStorage.removeItem('skillmatch_user');
    }
  }

  async deleteAccount(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/account`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Account deletion failed');
    }

    // Clear all data after successful deletion
    this.logout();
  }

  // Utility methods
  getStoredUser(): User | null {
    try {
      const userData = localStorage.getItem('skillmatch_user');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  getAccessToken(): string | null {
    return localStorage.getItem('skillmatch_access_token');
  }

  isTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= exp;
    } catch {
      return true;
    }
  }

  async ensureValidToken(): Promise<void> {
    if (this.isTokenExpired()) {
      await this.refreshToken();
    }
  }
}

export const authAPI = new AuthAPIService();
