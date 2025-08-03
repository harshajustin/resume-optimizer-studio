import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Smartphone, 
  Monitor, 
  Tablet, 
  Globe, 
  Clock, 
  Shield, 
  AlertTriangle,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { sessionAPI, ActiveSessionsResponse, SessionResponse, SessionStats } from '@/services/session';
import { formatDistanceToNow } from 'date-fns';

interface SessionManagerProps {
  onSessionRevoked?: () => void;
}

const SessionManager: React.FC<SessionManagerProps> = ({ onSessionRevoked }) => {
  const [sessions, setSessions] = useState<ActiveSessionsResponse | null>(null);
  const [stats, setStats] = useState<SessionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadSessionData();
  }, []);

  const loadSessionData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [sessionsData, statsData] = await Promise.all([
        sessionAPI.getActiveSessions(),
        sessionAPI.getSessionStats()
      ]);
      
      setSessions(sessionsData);
      setStats(statsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load session data');
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      setRevoking(prev => new Set([...prev, sessionId]));
      setError('');
      
      await sessionAPI.revokeSession(sessionId, 'user_requested');
      
      setSuccess('Session revoked successfully');
      await loadSessionData();
      
      if (onSessionRevoked) {
        onSessionRevoked();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to revoke session');
    } finally {
      setRevoking(prev => {
        const newSet = new Set(prev);
        newSet.delete(sessionId);
        return newSet;
      });
    }
  };

  const handleRevokeAllSessions = async () => {
    try {
      setLoading(true);
      setError('');
      
      const result = await sessionAPI.revokeAllSessions();
      setSuccess(result.message);
      
      await loadSessionData();
      
      if (onSessionRevoked) {
        onSessionRevoked();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to revoke all sessions');
    } finally {
      setLoading(false);
    }
  };

  const getDeviceIcon = (deviceType?: string) => {
    switch (deviceType?.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      case 'tablet':
        return <Tablet className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const getDeviceLabel = (session: SessionResponse) => {
    const deviceInfo = session.device_info;
    if (!deviceInfo) return 'Unknown Device';
    
    const device = deviceInfo.device_type || 'Desktop';
    const browser = deviceInfo.browser ? ` • ${deviceInfo.browser}` : '';
    const os = deviceInfo.os ? ` • ${deviceInfo.os}` : '';
    
    return `${device}${browser}${os}`;
  };

  const isCurrentSession = (sessionId: string) => {
    return sessions?.current_session_id === sessionId;
  };

  if (loading && !sessions) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Session Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading sessions...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.active_sessions}</div>
              <p className="text-sm text-muted-foreground">Active Sessions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.total_sessions}</div>
              <p className="text-sm text-muted-foreground">Total Sessions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.unique_devices}</div>
              <p className="text-sm text-muted-foreground">Unique Devices</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {stats.average_session_duration ? `${stats.average_session_duration.toFixed(1)}h` : 'N/A'}
              </div>
              <p className="text-sm text-muted-foreground">Avg. Duration</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Active Sessions ({sessions?.total_count || 0})
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadSessionData}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              {sessions && sessions.total_count > 1 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleRevokeAllSessions}
                  disabled={loading}
                >
                  <Trash2 className="h-4 w-4" />
                  Revoke All Others
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {sessions && sessions.sessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No active sessions found
            </div>
          ) : (
            <div className="space-y-4">
              {sessions?.sessions.map((session) => (
                <div
                  key={session.id}
                  className={`p-4 border rounded-lg ${
                    isCurrentSession(session.id) 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getDeviceIcon(session.device_info?.device_type)}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">
                            {getDeviceLabel(session)}
                          </h4>
                          {isCurrentSession(session.id) && (
                            <Badge variant="default">Current Session</Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                          {session.ip_address && (
                            <div className="flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              <span>{session.ip_address}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              Started {formatDistanceToNow(new Date(session.created_at), { addSuffix: true })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              Expires {formatDistanceToNow(new Date(session.expires_at), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {!isCurrentSession(session.id) && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRevokeSession(session.id)}
                        disabled={revoking.has(session.id)}
                      >
                        {revoking.has(session.id) ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        Revoke
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionManager;
