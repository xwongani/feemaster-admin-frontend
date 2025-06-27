import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedUserTypes?: ('parent' | 'admin')[];
  requireAuth?: boolean;
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedUserTypes = [], 
  requireAuth = true,
  fallbackPath = '/login'
}) => {
  const { isAuthenticated, userType } = useAuth();
  const location = useLocation();

  // If authentication is not required, render children
  if (!requireAuth) {
    return <>{children}</>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={fallbackPath} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // If user types are specified, check if current user type is allowed
  if (allowedUserTypes.length > 0 && userType && !allowedUserTypes.includes(userType)) {
    return (
      <Navigate 
        to="/unauthorized" 
        state={{ 
          from: location,
          requiredTypes: allowedUserTypes,
          currentType: userType
        }} 
        replace 
      />
    );
  }

  // User is authenticated and authorized, render children
  return <>{children}</>;
};

export default ProtectedRoute; 