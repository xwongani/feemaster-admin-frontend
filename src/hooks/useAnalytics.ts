import { useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { analyticsApi } from '../services/api';

export const useAnalytics = () => {
  const { user } = useAuth();

  const logDataAction = useCallback((action: 'create' | 'update' | 'delete' | 'view', resource: string, resource_id: string, details?: Record<string, any>) => {
    analyticsApi.logAction({
      action,
      resource,
      resource_id,
      details,
      user_id: user?.id,
      user_email: user?.email,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
    });
  }, [user?.id, user?.email]);

  return {
    logDataAction,
  };
}; 