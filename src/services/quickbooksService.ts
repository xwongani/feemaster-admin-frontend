const API_BASE_URL = (window as any).REACT_APP_API_BASE_URL || 'http://localhost:8000';

export interface QuickBooksAnalytics {
  summary: {
    total_payments: number;
    total_amount: number;
    average_payment: number;
    sync_timestamp: string;
    date_range: {
      start: string;
      end: string;
    };
  };
  payment_methods: Array<{
    method: string;
    count: number;
    amount: number;
    percentage: number;
  }>;
  daily_trends: Array<{
    date: string;
    amount: number;
  }>;
}

export interface QuickBooksSyncStatus {
  connected: boolean;
  last_sync: string | null;
  last_sync_success: boolean | null;
  records_synced: number;
  error_message: string | null;
  realm_id: string | null;
}

export const quickbooksService = {
  // Get QuickBooks authorization URL
  async getAuthUrl(): Promise<{ auth_url: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/quickbooks/auth-url`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error getting QuickBooks auth URL:', error);
      throw error;
    }
  },

  // Handle OAuth callback
  async handleCallback(code: string, realmId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/quickbooks/callback?code=${code}&realm_id=${realmId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to complete authorization');
      }
    } catch (error) {
      console.error('Error handling QuickBooks callback:', error);
      throw error;
    }
  },

  // Sync payments to cache
  async syncPaymentsToCache(daysBack: number = 30): Promise<{
    total_payments: number;
    date_range: { start: string; end: string };
    sync_timestamp: string;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/quickbooks/sync-payments-to-cache?days_back=${daysBack}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to sync payments');
      }

      return result.data;
    } catch (error) {
      console.error('Error syncing payments to cache:', error);
      throw error;
    }
  },

  // Get payment analytics
  async getPaymentAnalytics(): Promise<QuickBooksAnalytics> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/quickbooks/analytics/payments`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to get analytics');
      }

      return result.data;
    } catch (error) {
      console.error('Error getting payment analytics:', error);
      throw error;
    }
  },

  // Get sync status
  async getSyncStatus(): Promise<QuickBooksSyncStatus> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/quickbooks/sync-status`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to get sync status');
      }

      return result.data;
    } catch (error) {
      console.error('Error getting sync status:', error);
      throw error;
    }
  },

  // Clear cache
  async clearCache(): Promise<{ deleted_files: number; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/quickbooks/clear-cache`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to clear cache');
      }

      return result.data;
    } catch (error) {
      console.error('Error clearing cache:', error);
      throw error;
    }
  },

  // Get QuickBooks accounts
  async getAccounts(): Promise<Array<{ id: string; name: string; type: string; active: boolean }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/quickbooks/accounts`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to get accounts');
      }

      return result.data;
    } catch (error) {
      console.error('Error getting QuickBooks accounts:', error);
      throw error;
    }
  },

  // Get QuickBooks payment methods
  async getPaymentMethods(): Promise<Array<{ id: string; name: string }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/quickbooks/payment-methods`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to get payment methods');
      }

      return result.data;
    } catch (error) {
      console.error('Error getting QuickBooks payment methods:', error);
      throw error;
    }
  },

  // Sync individual payment to QuickBooks
  async syncPayment(paymentData: any): Promise<{ customer_id: string; invoice_id: string; payment_id: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/quickbooks/sync-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to sync payment');
      }

      return result.data;
    } catch (error) {
      console.error('Error syncing payment to QuickBooks:', error);
      throw error;
    }
  }
}; 