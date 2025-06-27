import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAnalytics } from '../hooks/useAnalytics';

const UnauthorizedPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userType, logout } = useAuth();
  const { logDataAction } = useAnalytics();

  // Get details from location state
  const from = location.state?.from?.pathname || '/';
  const requiredTypes = location.state?.requiredTypes || [];
  const currentType = location.state?.currentType || userType;

  React.useEffect(() => {
    logDataAction('Unauthorized Page', {
      from: from,
      required_types: requiredTypes,
      current_type: currentType
    });
  }, [from, requiredTypes, currentType]);

  const handleGoBack = () => {
    logDataAction('unauthorized_go_back');
    navigate(-1);
  };

  const handleGoHome = () => {
    logDataAction('unauthorized_go_home');
    navigate('/');
  };

  const handleLogout = () => {
    logDataAction('unauthorized_logout');
    logout();
  };

  const getErrorMessage = () => {
    if (requiredTypes.length > 0) {
      return `You need ${requiredTypes.join(' or ')} access to view this page.`;
    }
    return 'You do not have permission to access this page.';
  };

  const getCurrentUserType = () => {
    switch (currentType) {
      case 'admin':
        return 'Administrator';
      case 'parent':
        return 'Parent';
      default:
        return 'User';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg mb-6">
            <i className="fas fa-exclamation-triangle text-white text-2xl" aria-hidden="true"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to view this page</p>
        </div>

        {/* Error Details */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <i className="fas fa-lock text-red-600 text-2xl" aria-hidden="true"></i>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900">Unauthorized Access</h2>
            
            <p className="text-gray-600">
              {getErrorMessage()}
            </p>

            {currentType && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Current Account Type:</strong> {getCurrentUserType()}
                </p>
                {requiredTypes.length > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Required:</strong> {requiredTypes.map((type: string) => 
                      type === 'admin' ? 'Administrator' : 'Parent'
                    ).join(' or ')}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleGoBack}
                className="w-full secondary-btn focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                ← Go Back
              </button>
              
              <button
                onClick={handleGoHome}
                className="w-full primary-btn focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>

        {/* Additional Options */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Need Help?</h3>
          
          <div className="space-y-3">
            <Link
              to="/contact"
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              onClick={() => logDataAction('unauthorized_contact_support')}
            >
              <i className="fas fa-headset mr-2" aria-hidden="true"></i>
              Contact Support
            </Link>
            
            <Link
              to="/help"
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              onClick={() => logDataAction('unauthorized_help')}
            >
              <i className="fas fa-question-circle mr-2" aria-hidden="true"></i>
              Help & Documentation
            </Link>
            
            {currentType && (
              <button
                onClick={handleLogout}
                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
              >
                <i className="fas fa-sign-out-alt mr-2" aria-hidden="true"></i>
                Sign Out
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Error Code: 403 - Forbidden
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage; 