import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAnalytics } from '../hooks/useAnalytics';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';

const LoginPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'parent' | 'admin'>('parent');
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, isAuthenticated, userType } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { logDataAction } = useAnalytics();
  
  // Get the intended destination from location state or default to appropriate dashboard
  const from = location.state?.from?.pathname || 
    (activeTab === 'admin' ? '/admin/dashboard' : '/parent/dashboard');

  useEffect(() => {
    // logPageView('Login Page');
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (userType === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (userType === 'parent') {
        navigate('/parent/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, userType, navigate]);

  // Don't render login form while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="xl" text="Checking authentication..." />
      </div>
    );
  }

  // If already authenticated, redirect
  if (isAuthenticated) {
    return null; // Will be handled by useEffect
  }

  const handleTabChange = (tab: 'parent' | 'admin') => {
    setActiveTab(tab);
    setError(null);
    // logButtonClick(`login_tab_${tab}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    setError(null); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const result = await login(credentials.email, credentials.password, activeTab);
      
      if (result.success) {
        // logFormSubmit('login', true, { 
        //   email: credentials.email, 
        //   user_type: activeTab 
        // });
        navigate(from, { replace: true });
      } else {
        setError(result.error || 'Login failed. Please try again.');
        // logFormSubmit('login', false, { 
        //   email: credentials.email, 
        //   user_type: activeTab,
        //   error: result.error 
        // });
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred during login. Please try again.');
      // logFormSubmit('login', false, { 
      //   email: credentials.email, 
      //   user_type: activeTab,
      //   error: err.message 
      // });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // logButtonClick('forgot_password_link');
    navigate('/forgot-password');
  };

  const handleBackToHome = () => {
    // logButtonClick('back_to_home');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
            <i className="fas fa-graduation-cap text-white text-2xl" aria-hidden="true"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">FeeMaster</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          {error && (
            <Alert
              type="error"
              title="Login Failed"
              message={error}
              onClose={() => setError(null)}
            />
          )}

          {/* Tab Selection */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => handleTabChange('parent')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                activeTab === 'parent'
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              aria-label="Switch to parent login"
            >
              Parent Portal
            </button>
            <button
              onClick={() => handleTabChange('admin')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                activeTab === 'admin'
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              aria-label="Switch to admin login"
            >
              Admin Login
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="form-input"
                placeholder="Enter your email"
                value={credentials.email}
                onChange={handleInputChange}
                disabled={loading}
                aria-describedby="email-error"
              />
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="form-input pr-10"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  disabled={loading}
                  aria-describedby="password-error"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true"></i>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <button
                type="button"
                className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                onClick={handleForgotPassword}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="primary-btn w-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-describedby="submit-error"
            >
              {loading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Signing in...
                </>
              ) : (
                `Sign in as ${activeTab === 'admin' ? 'Admin' : 'Parent'}`
              )}
            </button>
          </form>

          {/* Demo Account Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Demo Account</h3>
            <p className="text-xs text-blue-700 mb-2">
              Email: <span className="font-mono">admin@feemaster.com</span>
            </p>
            <p className="text-xs text-blue-700">
              Password: <span className="font-mono">admin123</span>
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              onClick={() => {
                // logButtonClick('signup_link');
              }}
            >
              Contact your administrator
            </Link>
          </p>
          
          <button
            type="button"
            onClick={handleBackToHome}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          >
            ← Back to Home
          </button>
          
          <div className="flex justify-center space-x-6">
            <button
              type="button"
              className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded"
              onClick={() => {
                // logButtonClick('help_link');
                navigate('/help');
              }}
            >
              Help
            </button>
            <button
              type="button"
              className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded"
              onClick={() => {
                // logButtonClick('privacy_link');
                navigate('/privacy');
              }}
            >
              Privacy
            </button>
            <button
              type="button"
              className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded"
              onClick={() => {
                // logButtonClick('terms_link');
                navigate('/terms');
              }}
            >
              Terms
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 