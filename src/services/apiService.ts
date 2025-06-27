import axios from 'axios';

export const apiService = {
  auth: {
    login: async (credentials: { email: string; password: string; userType?: string }) => {
      const response = await axios.post('/api/auth/login', credentials);
      return response.data;
    },
    register: async (userData: any) => {
      const response = await axios.post('/api/auth/register', userData);
      return response.data;
    },
    logout: async () => {
      const response = await axios.post('/api/auth/logout');
      return response.data;
    },
    forgotPassword: async (email: string) => {
      const response = await axios.post('/api/auth/forgot-password', { email });
      return response.data;
    },
    resetPassword: async (token: string, password: string) => {
      const response = await axios.post('/api/auth/reset-password', { token, password });
      return response.data;
    }
  },
  students: {
    getAll: async () => {
      const response = await axios.get('/api/students');
      return response.data;
    },
    getById: async (id: string) => {
      const response = await axios.get(`/api/students/${id}`);
      return response.data;
    },
    create: async (studentData: any) => {
      const response = await axios.post('/api/students', studentData);
      return response.data;
    },
    update: async (id: string, studentData: any) => {
      const response = await axios.put(`/api/students/${id}`, studentData);
      return response.data;
    },
    delete: async (id: string) => {
      const response = await axios.delete(`/api/students/${id}`);
      return response.data;
    }
  },
  parent: {
    getStudents: async () => {
      const response = await axios.get('/api/parent/students');
      return response.data;
    },
    getFeeStatements: async (studentId: string) => {
      const response = await axios.get(`/api/parent/students/${studentId}/statements`);
      return response.data;
    },
    getPaymentHistory: async (studentId: string) => {
      const response = await axios.get(`/api/parent/students/${studentId}/payments`);
      return response.data;
    },
    makePayment: async (paymentData: any) => {
      const response = await axios.post('/api/parent/payments', paymentData);
      return response.data;
    },
    downloadStatement: async (studentId: string, statementId: string) => {
      const response = await axios.get(`/api/parent/students/${studentId}/statements/${statementId}/download`);
      return response.data;
    }
  },
  analytics: {
    logEvent: async (eventName: string, additionalData?: Record<string, any>) => {
      const response = await axios.post('/api/analytics/event', { eventName, additionalData });
      return response.data;
    },
    logFormSubmit: async (formName: string, success: boolean, additionalData?: Record<string, any>) => {
      const response = await axios.post('/api/analytics/form-submit', { formName, success, additionalData });
      return response.data;
    }
  }
}; 