import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

// Error Types
export class ApiError extends Error {
  public status: number;
  public errors?: Record<string, string[]>;
  public isNetworkError: boolean;

  constructor(message: string, status: number = 0, errors?: Record<string, string[]>, isNetworkError: boolean = false) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
    this.isNetworkError = isNetworkError;
  }
}

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/v1';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('access_token');
        window.location.href = '/login';
        return Promise.reject(new ApiError('Session expired. Please login again.', status));
      }
      
      if (status === 403) {
        return Promise.reject(new ApiError('You do not have permission to perform this action.', status));
      }
      
      if (status === 404) {
        return Promise.reject(new ApiError('The requested resource was not found.', status));
      }
      
      if (status === 422) {
        // Validation errors
        const responseData = data as any;
        return Promise.reject(new ApiError(
          responseData.message || 'Validation failed',
          status,
          responseData.errors
        ));
      }
      
      if (status >= 500) {
        return Promise.reject(new ApiError('Server error. Please try again later.', status));
      }
      
      // Other client errors
      const responseData = data as any;
      return Promise.reject(new ApiError(
        responseData.message || 'An error occurred',
        status
      ));
    } else if (error.request) {
      // Network error
      return Promise.reject(new ApiError(
        'Network error. Please check your connection and try again.',
        0,
        undefined,
        true
      ));
    } else {
      // Other error
      return Promise.reject(new ApiError('An unexpected error occurred.', 0));
    }
  }
);

// Generic API methods
export const api = {
  // GET request
  get: async <T>(url: string, params?: any): Promise<T> => {
    const response = await apiClient.get<ApiResponse<T>>(url, { params });
    return response.data.data as T;
  },

  // POST request
  post: async <T>(url: string, data?: any): Promise<T> => {
    const response = await apiClient.post<ApiResponse<T>>(url, data);
    return response.data.data as T;
  },

  // PUT request
  put: async <T>(url: string, data?: any): Promise<T> => {
    const response = await apiClient.put<ApiResponse<T>>(url, data);
    return response.data.data as T;
  },

  // PATCH request
  patch: async <T>(url: string, data?: any): Promise<T> => {
    const response = await apiClient.patch<ApiResponse<T>>(url, data);
    return response.data.data as T;
  },

  // DELETE request
  delete: async <T>(url: string): Promise<T> => {
    const response = await apiClient.delete<ApiResponse<T>>(url);
    return response.data.data as T;
  },

  // Upload file
  upload: async <T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<ApiResponse<T>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
    return response.data.data as T;
  },
};

// Auth API
export const authApi = {
  login: async (credentials: { email: string; password: string; user_type: 'parent' | 'admin' }) => {
    const response = await apiClient.post<ApiResponse<{ token: string; user: any }>>('/auth/login', credentials);
    return {
      success: response.data.success,
      token: response.data.data?.token,
      user: response.data.data?.user,
      message: response.data.message
    };
  },

  logout: async () => {
    try {
      await apiClient.post<ApiResponse>('/auth/logout');
      return { success: true };
    } catch (error) {
      // Even if logout fails, we should still clear local storage
      return { success: true };
    }
  },

  getCurrentUser: async () => {
    const response = await apiClient.get<ApiResponse<any>>('/auth/me');
    return {
      success: response.data.success,
      user: response.data.data,
      message: response.data.message
    };
  },

  verifyToken: async () => {
    const response = await apiClient.get<ApiResponse>('/auth/verify');
    return {
      success: response.data.success,
      message: response.data.message
    };
  },

  forgotPassword: async (email: string) => {
    const response = await apiClient.post<ApiResponse>('/auth/forgot-password', { email });
    return {
      success: response.data.success,
      message: response.data.message
    };
  },

  resetPassword: async (token: string, password: string) => {
    const response = await apiClient.post<ApiResponse>('/auth/reset-password', { token, password });
    return {
      success: response.data.success,
      message: response.data.message
    };
  },

  refreshToken: async () => {
    const response = await apiClient.post<ApiResponse<{ token: string }>>('/auth/refresh');
    return {
      success: response.data.success,
      token: response.data.data?.token,
      message: response.data.message
    };
  },

  register: async (userData: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    password: string;
    confirm_password: string;
    user_type: 'parent' | 'admin';
  }) => {
    const response = await apiClient.post<ApiResponse>('/auth/register', userData);
    return {
      success: response.data.success,
      message: response.data.message
    };
  }
};

// Dashboard API
export const dashboardApi = {
  getStats: async () => {
    return api.get<any>('/dashboard/stats');
  },

  getGradeDistribution: async () => {
    return api.get<any[]>('/dashboard/grade-distribution');
  },

  getRevenueChart: async (period: string = 'week') => {
    return api.get<any>('/dashboard/revenue-chart', { period });
  },

  getQuickActions: async () => {
    return api.get<any[]>('/dashboard/quick-actions');
  },

  getRecentActivities: async () => {
    return api.get<any[]>('/dashboard/recent-activities');
  },
};

// Students API
export const studentsApi = {
  getAll: async (params?: any) => {
    return api.get<PaginatedResponse<any>>('/students', params);
  },

  getById: async (id: string) => {
    return api.get<any>(`/students/${id}`);
  },

  create: async (data: any) => {
    return api.post<any>('/students', data);
  },

  update: async (id: string, data: any) => {
    return api.put<any>(`/students/${id}`, data);
  },

  delete: async (id: string) => {
    return api.delete(`/students/${id}`);
  },

  bulkImport: async (file: File) => {
    return api.upload<any>('/students/import', file);
  },
};

// Payments API
export const paymentsApi = {
  getAll: async (params?: any) => {
    return api.get<PaginatedResponse<any>>('/payments', params);
  },

  getById: async (id: string) => {
    return api.get<any>(`/payments/${id}`);
  },

  create: async (data: any) => {
    return api.post<any>('/payments', data);
  },

  update: async (id: string, data: any) => {
    return api.put<any>(`/payments/${id}`, data);
  },

  delete: async (id: string) => {
    return api.delete(`/payments/${id}`);
  },

  getReceipt: async (id: string) => {
    return api.get<any>(`/payments/${id}/receipt`);
  },

  sendReminder: async (id: string) => {
    return api.post(`/payments/${id}/remind`);
  },
};

// Reports API
export const reportsApi = {
  generateReport: async (type: string, params?: any) => {
    return api.post<any>(`/reports/${type}`, params);
  },

  getReportTypes: async () => {
    return api.get<string[]>('/reports/types');
  },

  downloadReport: async (id: string) => {
    const response = await apiClient.get(`/reports/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

// Settings API
export const settingsApi = {
  getSettings: async () => {
    return api.get<any>('/settings');
  },

  updateSettings: async (data: any) => {
    return api.put<any>('/settings', data);
  },

  getIntegrations: async () => {
    return api.get<any[]>('/settings/integrations');
  },

  updateIntegration: async (id: string, data: any) => {
    return api.put<any>(`/settings/integrations/${id}`, data);
  },
};

// Parent Portal API
export const parentPortalApi = {
  lookupParentOrStudent: async (payload: { student_id?: string; parent_phone?: string }) => {
    return api.post<any>('/parent-portal/parent-lookup', payload);
  },

  signupParent: async (payload: any) => {
    return api.post<any>('/parents', payload);
  },

  updateParent: async (parentId: string, payload: any) => {
    return api.put<any>(`/parents/${parentId}`, payload);
  },

  deleteParent: async (parentId: string) => {
    return api.delete(`/parents/${parentId}`);
  },

  makePayment: async (payload: any) => {
    return api.post<any>('/payments', payload);
  },
};

// Analytics API
export const analyticsApi = {
  logRouteChange: async (data: {
    path: string;
    search: string;
    user_id?: string;
    user_email?: string;
    timestamp: string;
    user_agent: string;
    referrer: string;
  }) => {
    return api.post('/analytics/route-log', data);
  },

  logLogin: async (data: {
    user_id: string;
    user_email: string;
    timestamp: string;
    user_agent: string;
    ip_address: string;
  }) => {
    return api.post('/analytics/login-log', data);
  },

  logLogout: async (data: {
    user_id: string;
    user_email: string;
    timestamp: string;
    user_agent: string;
  }) => {
    return api.post('/analytics/logout-log', data);
  },

  logAction: async (data: {
    action: string;
    resource: string;
    resource_id?: string;
    details?: any;
    user_id?: string;
    user_email?: string;
    timestamp: string;
    user_agent: string;
  }) => {
    return api.post('/analytics/action-log', data);
  },

  getAnalytics: async (params?: {
    start_date?: string;
    end_date?: string;
    user_id?: string;
    action_type?: string;
  }) => {
    return api.get('/analytics', params);
  },
};

export default apiClient; 