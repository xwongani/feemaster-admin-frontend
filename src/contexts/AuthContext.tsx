import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../services/api';
import { useAnalytics } from '../hooks/useAnalytics';

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  school_id?: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  userType: 'admin' | 'parent' | null;
  authLoading: boolean;
  login: (email: string, password: string, userType: 'admin' | 'parent') => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (userData: any, userType: 'admin' | 'parent') => Promise<{ success: boolean; error?: string }>;
  resetPassword: (token: string, password: string) => Promise<void>;
  isAuthenticated: boolean;
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
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<'admin' | 'parent' | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const { logDataAction } = useAnalytics();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const storedUserType = localStorage.getItem('userType') as 'admin' | 'parent' | null;
        const userData = localStorage.getItem('userData');

        if (token && storedUserType && userData) {
          // Verify token with backend
          const response = await authApi.verifyToken();
          if (response.success) {
            // Fetch user info
            const userResp = await authApi.getCurrentUser();
            if (userResp.success && userResp.user) {
              setUser(userResp.user);
              setUserType(storedUserType);
              logDataAction('view', 'session_restored', undefined, { user_type: storedUserType });
            } else {
              logout();
            }
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('authToken');
            localStorage.removeItem('userType');
            localStorage.removeItem('userData');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear invalid data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userType');
        localStorage.removeItem('userData');
      } finally {
        setAuthLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string, userType: 'admin' | 'parent'): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authApi.login({ email, password, user_type: userType });
      if (response.user && response.token) {
        setUser(response.user);
        setUserType(userType);
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userType', userType);
        localStorage.setItem('userData', JSON.stringify(response.user));
        return { success: true };
      } else {
        return { success: false, error: response.message || 'Login failed' };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = () => {
    try {
      // Log logout event
      if (user) {
        console.log(`${userType} logout:`, user.email);
        logDataAction('update', 'user_session', user.id, { user_type: userType });
      }
      
      // Clear auth state
      setUser(null);
      setUserType(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('userType');
      localStorage.removeItem('userData');
      
      // Call logout API (optional - for server-side session cleanup)
      authApi.logout().catch(error => {
        console.error('Logout API error:', error);
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const register = async (userData: any, userType: 'admin' | 'parent'): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authApi.register({ ...userData, user_type: userType });
      if (response.user && response.token) {
        setUser(response.user);
        setUserType(userType);
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userType', userType);
        localStorage.setItem('userData', JSON.stringify(response.user));
        return { success: true };
      } else {
        return { success: false, error: response.message || 'Registration failed' };
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      const response = await authApi.resetPassword(token, password);
      if (!response.success) {
        throw new Error(response.message || 'Password reset failed');
      }
    } catch (error: any) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    userType,
    authLoading,
    login,
    logout,
    register,
    resetPassword,
    isAuthenticated: !!user && !!userType
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 