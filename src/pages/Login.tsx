import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../App';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');
  const { login, user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Invalid email or password. Please try again.');
        setPassword('');
      }
    } catch (err) {
      setError('Network or server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotMessage('');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/v1/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
      if (response.ok) {
        setForgotMessage('If an account with that email exists, a reset link has been sent.');
      } else {
        setForgotMessage('Unable to process request. Please try again later.');
      }
    } catch (err) {
      setForgotMessage('Network error. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <i className="fas fa-graduation-cap text-white text-xl"></i>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Fee Master Admin
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your admin account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} autoComplete="on">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="form-input w-full"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="form-input w-full pr-10"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-700 focus:outline-none"
                tabIndex={-1}
                onClick={() => setShowPassword((show) => !show)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <button
                type="button"
                className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
                onClick={() => setShowForgot(true)}
              >
                Forgot password?
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full primary-btn justify-center flex items-center gap-2"
            >
              {loading && (
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
              )}
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        {/* Forgot Password Modal */}
        {showForgot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                onClick={() => {
                  setShowForgot(false);
                  setForgotEmail('');
                  setForgotMessage('');
                }}
                aria-label="Close"
              >
                <i className="fas fa-times"></i>
              </button>
              <h3 className="text-lg font-bold mb-4 text-gray-900">Forgot Password</h3>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Enter your email address
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    className="form-input w-full"
                    placeholder="Email address"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    disabled={forgotLoading}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full primary-btn flex items-center justify-center gap-2"
                  disabled={forgotLoading}
                >
                  {forgotLoading && (
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                  )}
                  {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
                {forgotMessage && (
                  <div className="text-sm text-center text-green-600 mt-2">{forgotMessage}</div>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login; 