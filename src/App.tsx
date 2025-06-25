import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import ParentLookupForm from './pages/ParentLookupForm';
import ParentSignupForm from './pages/ParentSignupForm';
import ParentStudentInfo from './pages/ParentStudentInfo';
import ParentPaymentPage from './pages/ParentPaymentPage';
import ParentPaymentConfirmation from './pages/ParentPaymentConfirmation';
import ParentUpdateForm from './pages/ParentUpdateForm';
import ParentDeleteAccount from './pages/ParentDeleteAccount';
import { ParentPortalProvider } from './contexts/parentPortalContext';
import './index.css';

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

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('access_token');
    if (token) {
      // Verify token with backend
      fetch(`${process.env.REACT_APP_API_BASE_URL}/api/v1/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUser(data.data);
        } else {
          localStorage.removeItem('access_token');
        }
      })
      .catch(() => {
        localStorage.removeItem('access_token');
      })
      .finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
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
      
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        setUser(data.user);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
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
            <Route path="/parent-portal/*" element={
              <ParentPortalProvider>
                <ParentPortalLayout />
              </ParentPortalProvider>
            }>
              <Route index element={<ParentLookupForm />} />
              <Route path="signup" element={<ParentSignupForm />} />
              <Route path="student" element={<ParentStudentInfo />} />
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
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 