import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, User } from '@/services/auth';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, name: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored auth on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = authAPI.getStoredUser();
        const accessToken = authAPI.getAccessToken();
        
        if (storedUser && accessToken) {
          // Check if token is still valid
          if (!authAPI.isTokenExpired()) {
            setUser(storedUser);
          } else {
            // Try to refresh the token
            try {
              await authAPI.refreshToken();
              // Get updated user info
              const currentUser = await authAPI.getCurrentUser();
              setUser(currentUser);
            } catch (error) {
              // Refresh failed, clear auth data
              authAPI.logout();
              setUser(null);
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        authAPI.logout();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const authResponse = await authAPI.login({ email, password });
      setUser(authResponse.user);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, name: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const authResponse = await authAPI.register({ email, name, password });
      setUser(authResponse.user);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const currentUser = await authAPI.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};