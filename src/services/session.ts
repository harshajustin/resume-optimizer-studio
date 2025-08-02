import { AuthResponse, User } from './auth';

// Session Management Types
export interface DeviceInfo {
  device_type?: string;
  os?: string;
  browser?: string;
  browser_version?: string;
  user_agent?: string;
  screen_resolution?: string;
  timezone?: string;
}

export interface SessionResponse {
  id: string;
  user_id: string;
  device_info?: DeviceInfo;
  ip_address?: string;
  expires_at: string;
  is_revoked: boolean;
  created_at: string;
  last_activity?: string;
}

export interface ActiveSessionsResponse {
  sessions: SessionResponse[];
  total_count: number;
  current_session_id?: string;
}

export interface SessionStats {
  total_sessions: number;
  active_sessions: number;
  revoked_sessions: number;
  expired_sessions: number;
  unique_devices: number;
  most_recent_activity?: string;
  average_session_duration?: number;
}

export interface SessionSecurity {
  suspicious_activities: Array<{
    type: string;
    description: string;
    timestamp: string;
    metadata?: Record<string, any>;
  }>;
  login_attempts: number;
  last_failed_login?: string;
  account_locked: boolean;
  lock_expires_at?: string;
}

export interface SessionRevoke {
  session_id: string;
  reason?: string;
}

export interface BulkSessionRevoke {
  session_ids: string[];
  reason?: string;
  exclude_current?: boolean;
}

// Session API Service
class SessionAPIService {
  private baseURL = 'http://localhost:8000/api/v1';

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('skillmatch_access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getActiveSessions(): Promise<ActiveSessionsResponse> {
    const response = await fetch(`${this.baseURL}/sessions/active`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch active sessions');
    }

    return response.json();
  }

  async revokeSession(sessionId: string, reason?: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/sessions/revoke`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        session_id: sessionId,
        reason: reason || 'user_requested',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to revoke session');
    }
  }

  async revokeAllSessions(): Promise<{ message: string }> {
    const response = await fetch(`${this.baseURL}/sessions/revoke-all`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to revoke all sessions');
    }

    return response.json();
  }

  async revokeBulkSessions(sessionIds: string[], reason?: string): Promise<{ message: string }> {
    const response = await fetch(`${this.baseURL}/sessions/revoke-bulk`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        session_ids: sessionIds,
        reason: reason || 'user_requested',
        exclude_current: true,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to revoke sessions');
    }

    return response.json();
  }

  async getSessionStats(): Promise<SessionStats> {
    const response = await fetch(`${this.baseURL}/sessions/stats`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch session statistics');
    }

    return response.json();
  }

  async getSessionSecurity(): Promise<SessionSecurity> {
    const response = await fetch(`${this.baseURL}/sessions/security`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch security information');
    }

    return response.json();
  }

  async cleanupExpiredSessions(): Promise<{ message: string }> {
    const response = await fetch(`${this.baseURL}/sessions/cleanup`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to cleanup sessions');
    }

    return response.json();
  }

  // Enhanced logout with session revocation
  async logout(): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/auth/logout`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Logout failed');
      }
    } finally {
      // Always clear local storage, even if logout request fails
      localStorage.removeItem('skillmatch_access_token');
      localStorage.removeItem('skillmatch_refresh_token');
      localStorage.removeItem('skillmatch_user');
    }
  }

  // Device fingerprinting helper
  getDeviceFingerprint(): DeviceInfo {
    const userAgent = navigator.userAgent;
    const screen = window.screen;
    
    return {
      device_type: /Mobile|Tablet/.test(userAgent) ? 'mobile' : 'desktop',
      user_agent: userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }
}

export const sessionAPI = new SessionAPIService();
