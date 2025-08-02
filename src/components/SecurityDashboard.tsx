import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Globe,
  Smartphone,
  RefreshCw
} from 'lucide-react';
import { sessionAPI, SessionSecurity } from '@/services/session';
import { formatDistanceToNow } from 'date-fns';

const SecurityDashboard: React.FC = () => {
  const [security, setSecurity] = useState<SessionSecurity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const securityData = await sessionAPI.getSessionSecurity();
      setSecurity(securityData);
    } catch (err: any) {
      setError(err.message || 'Failed to load security data');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'multiple_logins':
        return <Smartphone className="h-4 w-4 text-orange-500" />;
      case 'suspicious_location':
        return <Globe className="h-4 w-4 text-red-500" />;
      case 'failed_login':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityBadgeVariant = (activityType: string) => {
    switch (activityType) {
      case 'multiple_logins':
        return 'secondary' as const;
      case 'suspicious_location':
      case 'failed_login':
        return 'destructive' as const;
      default:
        return 'outline' as const;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading security data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!security) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Security Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {security.account_locked ? 'Locked' : 'Active'}
                </div>
                <p className="text-sm text-muted-foreground">Account Status</p>
              </div>
              <div className={security.account_locked ? 'text-red-500' : 'text-green-500'}>
                {security.account_locked ? (
                  <AlertTriangle className="h-8 w-8" />
                ) : (
                  <CheckCircle className="h-8 w-8" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{security.login_attempts}</div>
                <p className="text-sm text-muted-foreground">Failed Login Attempts</p>
              </div>
              <div className={security.login_attempts > 0 ? 'text-orange-500' : 'text-green-500'}>
                <Shield className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{security.suspicious_activities.length}</div>
                <p className="text-sm text-muted-foreground">Suspicious Activities</p>
              </div>
              <div className={security.suspicious_activities.length > 0 ? 'text-red-500' : 'text-green-500'}>
                <AlertTriangle className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Lock Information */}
      {security.account_locked && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Your account is currently locked due to security concerns.
            {security.lock_expires_at && (
              <span>
                {' '}Lock expires {formatDistanceToNow(new Date(security.lock_expires_at), { addSuffix: true })}.
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Suspicious Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Recent Security Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          {security.suspicious_activities.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-green-700 mb-2">All Clear!</h3>
              <p className="text-muted-foreground">
                No suspicious activities detected in your account.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {security.suspicious_activities.map((activity, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg bg-red-50 border-red-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-red-800">
                            {activity.description}
                          </h4>
                          <Badge variant={getActivityBadgeVariant(activity.type)}>
                            {activity.type.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-red-600 space-y-1">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                            </span>
                          </div>
                          
                          {activity.metadata && (
                            <div className="mt-2">
                              <details className="text-xs">
                                <summary className="cursor-pointer hover:text-red-800">
                                  View Details
                                </summary>
                                <div className="mt-1 p-2 bg-red-100 rounded">
                                  <pre className="whitespace-pre-wrap">
                                    {JSON.stringify(activity.metadata, null, 2)}
                                  </pre>
                                </div>
                              </details>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Use Strong Passwords</h4>
                <p className="text-sm text-muted-foreground">
                  Ensure your password is at least 8 characters with uppercase, lowercase, numbers, and symbols.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Monitor Active Sessions</h4>
                <p className="text-sm text-muted-foreground">
                  Regularly check your active sessions and revoke any sessions you don't recognize.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Secure Networks</h4>
                <p className="text-sm text-muted-foreground">
                  Avoid logging in from public or unsecured Wi-Fi networks.
                </p>
              </div>
            </div>
            
            {security.suspicious_activities.length > 0 && (
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Review Recent Activity</h4>
                  <p className="text-sm text-muted-foreground">
                    We've detected some unusual activity. Please review your recent sessions and change your password if needed.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityDashboard;
