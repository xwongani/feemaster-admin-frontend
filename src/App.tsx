import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import * as Sentry from "@sentry/react";
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Payments from './pages/Payments';
import FinancialDashboard from './pages/FinancialDashboard';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Integrations from './pages/Integrations';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import ResetPassword from './pages/ResetPassword';
import ParentPortalLayout from './pages/ParentPortalLayout';
import ParentStudentInfo from './pages/ParentStudentInfo';
import ParentPaymentPage from './pages/ParentPaymentPage';
import ParentPaymentConfirmation from './pages/ParentPaymentConfirmation';
import ParentUpdateForm from './pages/ParentUpdateForm';
import ParentDeleteAccount from './pages/ParentDeleteAccount';
import { ParentPortalProvider } from './contexts/parentPortalContext';
import ParentLogin from './pages/ParentLogin';
import './index.css';
// import './sentry'; // Import Sentry configuration
// import { SentryErrorBoundary } from './components/ErrorBoundary';

// Simple auth context for backend API
interface User {
  id: string;
  email: string;
  role: string;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/v1/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(data.data);
        } else {
          // Token is invalid or expired
          localStorage.removeItem('access_token');
          setUser(null);
        }
      } else {
        // Token is invalid or expired
        localStorage.removeItem('access_token');
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // On network error, keep the token but don't set user
      // This allows for offline functionality if needed
      localStorage.removeItem('access_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (response.ok && data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        setUser(data.user);
        return true;
      } else {
        console.error('Login failed:', data);
        return false;
      }
    } catch (error) {
      console.error('Login network error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    // Force a page reload to clear any cached state
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            {/* Parent Portal Public Routes */}
            <Route path="/parent-portal" element={<Navigate to="/parent-portal/login" replace />} />
            <Route path="/parent-portal/login" element={<ParentLogin />} />
            <Route path="/parent-portal/dashboard" element={
              <ParentPortalProvider>
                <ParentPortalLayout />
              </ParentPortalProvider>
            }>
              <Route index element={<ParentStudentInfo />} />
              <Route path="pay" element={<ParentPaymentPage />} />
              <Route path="confirmation" element={<ParentPaymentConfirmation />} />
              <Route path="update" element={<ParentUpdateForm />} />
              <Route path="delete" element={<ParentDeleteAccount />} />
            </Route>
            {/* Admin Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="students" element={<Students />} />
              <Route path="payments" element={<Payments />} />
              <Route path="financial-dashboard" element={<FinancialDashboard />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
              <Route path="integrations" element={<Integrations />} />
            </Route>
            {/* Catch all route for any unmatched paths */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 