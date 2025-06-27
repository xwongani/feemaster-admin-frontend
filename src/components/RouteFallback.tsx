import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAnalytics } from '../hooks/useAnalytics';
import LoadingSpinner from './LoadingSpinner';

const RouteFallback: React.FC = () => {
  const { isAuthenticated, userType, authLoading } = useAuth();
  const location = useLocation();
  const { logDataAction } = useAnalytics();

  React.useEffect(() => {
    logDataAction('view', '404_not_found', '404_not_found', { 
      path: location.pathname,
      search: location.search,
      isAuthenticated,
      userType 
    });
  }, [location.pathname, isAuthenticated, userType]);

  // Show loading spinner while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="xl" text="Loading..." />
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Route authenticated users to their appropriate dashboard
  if (userType === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (userType === 'parent') {
    return <Navigate to="/parent/dashboard" replace />;
  }

  // Fallback to login if user type is unknown
  return <Navigate to="/login" replace />;
};

export default RouteFallback; 