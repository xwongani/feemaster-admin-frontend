import React, { useState, useEffect, useCallback } from 'react';
import { quickbooksService, QuickBooksAnalytics, QuickBooksSyncStatus } from '../services/quickbooksService';

interface Integration {
  id: string;
  name: string;
  icon: string;
  status: 'connected' | 'not-connected' | 'error';
  description: string;
  lastSync?: string;
  error_message?: string;
  features?: string[];
}

interface ActivityLog {
  id: string;
  datetime: string;
  integration: string;
  activity: string;
  status: 'success' | 'failed' | 'pending';
  details: string;
}

const Integrations: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfigModal, setShowConfigModal] = useState<string | null>(null);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // QuickBooks specific state
  const [showQuickBooksAnalytics, setShowQuickBooksAnalytics] = useState(false);
  const [quickBooksAnalytics, setQuickBooksAnalytics] = useState<QuickBooksAnalytics | null>(null);
  const [quickBooksSyncStatus, setQuickBooksSyncStatus] = useState<QuickBooksSyncStatus | null>(null);
  const [syncingPayments, setSyncingPayments] = useState(false);
  const [daysBack, setDaysBack] = useState(30);

  const [configForms, setConfigForms] = useState({
    quickbooks: {
      clientId: '',
      clientSecret: '',
      environment: 'sandbox'
    },
    whatsapp: {
      phoneNumber: '',
      apiKey: '',
      webhook: ''
    },
    sms_gateway: {
      apiKey: '',
      senderId: '',
      provider: 'twilio'
    },
    email_service: {
      smtpHost: '',
      smtpPort: '',
      username: '',
      password: ''
    }
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  const API_BASE_URL = (window as any).REACT_APP_API_BASE_URL || 'http://localhost:8000';

  const fetchIntegrations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/integrations`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Map backend data to frontend structure
        const mappedIntegrations = result.data.map((integration: any) => ({
          id: integration.id,
          name: integration.name,
          icon: getIntegrationIcon(integration.id),
          status: integration.status === 'connected' ? 'connected' : 
                  integration.status === 'error' ? 'error' : 'not-connected',
          description: integration.description,
          lastSync: integration.last_sync,
          error_message: integration.error_message,
          features: integration.features || []
        }));
        
        setIntegrations(mappedIntegrations);
      } else {
        throw new Error(result.message || 'Failed to fetch integrations');
      }
    } catch (err) {
      console.error('Error fetching integrations:', err);
      setError('Failed to load integrations. Please try again.');
      
      // Fallback data
      setIntegrations([
        {
          id: 'quickbooks',
          name: 'QuickBooks',
          icon: 'fas fa-book',
          status: 'not-connected',
          description: 'Connect with QuickBooks to sync your financial data and automate accounting processes.'
        },
        {
          id: 'whatsapp',
          name: 'WhatsApp',
          icon: 'fab fa-whatsapp',
          status: 'connected',
          description: 'Connect with WhatsApp to enable messaging features for payment notifications.',
          lastSync: '2024-01-15 14:30:22'
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchIntegrations();
    fetchActivityLogs();
    fetchQuickBooksStatus();
  }, [fetchIntegrations]);

  const fetchQuickBooksStatus = async () => {
    try {
      const status = await quickbooksService.getSyncStatus();
      setQuickBooksSyncStatus(status);
    } catch (error) {
      console.error('Failed to fetch QuickBooks status:', error);
    }
  };

  const fetchQuickBooksAnalytics = async () => {
    try {
      const analytics = await quickbooksService.getPaymentAnalytics();
      setQuickBooksAnalytics(analytics);
    } catch (error) {
      console.error('Failed to fetch QuickBooks analytics:', error);
      setError('Failed to load QuickBooks analytics. Please sync payments first.');
    }
  };

  const handleQuickBooksConnect = async () => {
    try {
      setActionLoading('quickbooks');
      const authData = await quickbooksService.getAuthUrl();
      
      // Open QuickBooks authorization in new window
      const authWindow = window.open(
        authData.auth_url, 
        'QuickBooks Auth', 
        'width=600,height=600,scrollbars=yes,resizable=yes'
      );

      // Listen for the callback
      const checkClosed = setInterval(async () => {
        if (authWindow?.closed) {
          clearInterval(checkClosed);
          // Refresh status after authorization
          await fetchQuickBooksStatus();
          await fetchIntegrations();
        }
      }, 1000);

      // Add activity log
      const newLog: ActivityLog = {
        id: `log-${Date.now()}`,
        datetime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        integration: 'QuickBooks',
        activity: 'Authorization Initiated',
        status: 'pending',
        details: 'QuickBooks authorization window opened'
      };
      setActivityLogs(prev => [newLog, ...prev]);

    } catch (error) {
      console.error('Error connecting QuickBooks:', error);
      setError('Failed to start QuickBooks authorization. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleQuickBooksSync = async () => {
    try {
      setSyncingPayments(true);
      const result = await quickbooksService.syncPaymentsToCache(daysBack);
      
      // Add activity log
      const newLog: ActivityLog = {
        id: `log-${Date.now()}`,
        datetime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        integration: 'QuickBooks',
        activity: 'Sync Payments',
        status: 'success',
        details: `Synced ${result.total_payments} payments from QuickBooks`
      };
      setActivityLogs(prev => [newLog, ...prev]);

      // Refresh status and analytics
      await fetchQuickBooksStatus();
      await fetchQuickBooksAnalytics();
      
      setError(null);
    } catch (error) {
      console.error('Error syncing QuickBooks payments:', error);
      setError('Failed to sync payments from QuickBooks. Please try again.');
      
      // Add error log
      const newLog: ActivityLog = {
        id: `log-${Date.now()}`,
        datetime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        integration: 'QuickBooks',
        activity: 'Sync Payments',
        status: 'failed',
        details: 'Failed to sync payments from QuickBooks'
      };
      setActivityLogs(prev => [newLog, ...prev]);
    } finally {
      setSyncingPayments(false);
    }
  };

  const handleQuickBooksClearCache = async () => {
    if (!window.confirm('Are you sure you want to clear the QuickBooks cache? This will delete all locally stored payment data.')) {
      return;
    }

    try {
      setActionLoading('quickbooks');
      await quickbooksService.clearCache();
      
      // Clear analytics
      setQuickBooksAnalytics(null);
      
      // Add activity log
      const newLog: ActivityLog = {
        id: `log-${Date.now()}`,
        datetime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        integration: 'QuickBooks',
        activity: 'Clear Cache',
        status: 'success',
        details: 'QuickBooks cache cleared successfully'
      };
      setActivityLogs(prev => [newLog, ...prev]);
      
      setError(null);
    } catch (error) {
      console.error('Error clearing QuickBooks cache:', error);
      setError('Failed to clear QuickBooks cache. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const fetchActivityLogs = async () => {
    try {
      // For now, use static data - in production, fetch from API
      const logs: ActivityLog[] = [
        {
          id: 'log1',
          datetime: '2024-01-15 14:30:22',
          integration: 'QuickBooks',
          activity: 'Sync Invoices',
          status: 'success',
          details: 'Successfully synced 25 invoices to QuickBooks'
        },
        {
          id: 'log2',
          datetime: '2024-01-15 14:15:07',
          integration: 'WhatsApp',
          activity: 'Send Payment Notification',
          status: 'success',
          details: 'Payment notification sent to 15 parents'
        }
      ];
      
      setActivityLogs(logs);
    } catch (err) {
      console.error('Error fetching activity logs:', err);
    }
  };

  const getIntegrationIcon = (integrationId: string): string => {
    const iconMap: { [key: string]: string } = {
      'quickbooks': 'fas fa-book',
      'whatsapp': 'fab fa-whatsapp',
      'sms_gateway': 'fas fa-sms',
      'email_service': 'fas fa-envelope'
    };
    return iconMap[integrationId] || 'fas fa-plug';
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      connected: 'bg-green-100 text-green-800',
      'not-connected': 'bg-gray-100 text-gray-800',
      error: 'bg-red-100 text-red-800',
      success: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    const statusText = {
      connected: 'Connected',
      'not-connected': 'Not Connected',
      error: 'Error',
      success: 'Success',
      failed: 'Failed',
      pending: 'Pending'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status as keyof typeof statusClasses]}`}>
        {statusText[status as keyof typeof statusText]}
      </span>
    );
  };

  const getStatusIndicator = (status: string) => {
    const colorClasses = {
      connected: 'bg-green-500',
      'not-connected': 'bg-gray-400',
      error: 'bg-red-500'
    };
    return <div className={`w-3 h-3 rounded-full ${colorClasses[status as keyof typeof colorClasses]}`}></div>;
  };

  const handleConnect = async (integrationId: string) => {
    try {
      setActionLoading(integrationId);
      
      const config = configForms[integrationId as keyof typeof configForms];
      
      const response = await fetch(`${API_BASE_URL}/integrations/${integrationId}/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Update integration status
        setIntegrations(prev => prev.map(integration => 
          integration.id === integrationId 
            ? { ...integration, status: 'connected' as const, lastSync: new Date().toISOString().slice(0, 19).replace('T', ' ') }
            : integration
        ));
        
        // Add activity log
        const newLog: ActivityLog = {
          id: `log-${Date.now()}`,
          datetime: new Date().toISOString().slice(0, 19).replace('T', ' '),
          integration: integrations.find(i => i.id === integrationId)?.name || integrationId,
          activity: 'Connection Established',
          status: 'success',
          details: result.message || 'Integration connected successfully'
        };
        setActivityLogs(prev => [newLog, ...prev]);
        
        setShowConfigModal(null);
      } else {
        throw new Error(result.message || 'Failed to connect integration');
      }
    } catch (err) {
      console.error(`Error connecting ${integrationId}:`, err);
      setError(`Failed to connect ${integrationId}. Please check your configuration and try again.`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDisconnect = async (integrationId: string) => {
    try {
      setActionLoading(integrationId);
      
      const response = await fetch(`${API_BASE_URL}/integrations/${integrationId}/disconnect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setIntegrations(prev => prev.map(integration => 
          integration.id === integrationId 
            ? { ...integration, status: 'not-connected' as const, lastSync: undefined }
            : integration
        ));
        
        // Add activity log
        const newLog: ActivityLog = {
          id: `log-${Date.now()}`,
          datetime: new Date().toISOString().slice(0, 19).replace('T', ' '),
          integration: integrations.find(i => i.id === integrationId)?.name || integrationId,
          activity: 'Disconnected',
          status: 'success',
          details: 'Integration disconnected successfully'
        };
        setActivityLogs(prev => [newLog, ...prev]);
      } else {
        throw new Error(result.message || 'Failed to disconnect integration');
      }
    } catch (err) {
      console.error(`Error disconnecting ${integrationId}:`, err);
      setError(`Failed to disconnect ${integrationId}. Please try again.`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleTest = async (integrationId: string) => {
    try {
      setActionLoading(integrationId);
      
      const response = await fetch(`${API_BASE_URL}/integrations/${integrationId}/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        const integration = integrations.find(i => i.id === integrationId);
        const newLog: ActivityLog = {
          id: `log-${Date.now()}`,
          datetime: new Date().toISOString().slice(0, 19).replace('T', ' '),
          integration: integration?.name || integrationId,
          activity: 'Test Connection',
          status: 'success',
          details: result.message || `Test successful for ${integration?.name}`
        };
        setActivityLogs(prev => [newLog, ...prev]);
      } else {
        throw new Error(result.message || 'Test failed');
      }
    } catch (err) {
      console.error(`Error testing ${integrationId}:`, err);
      setError(`Test failed for ${integrationId}. Please try again.`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSaveConfig = (integrationId: string) => {
    handleConnect(integrationId);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
            <p className="text-gray-600">Connect external services to enhance your school management system.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search integrations..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={loading}
              />
            </div>
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              <i className="fas fa-plus"></i>
              New Integration
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <i className="fas fa-exclamation-circle text-red-400"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <div className="ml-auto">
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading integrations...</span>
          </div>
        </div>
      )}

      {/* Integration Cards */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {integrations.map((integration) => (
            <div key={integration.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                {/* Integration Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      integration.id === 'quickbooks' ? 'bg-blue-100' :
                      integration.id === 'whatsapp' ? 'bg-green-100' :
                      integration.id === 'sms_gateway' ? 'bg-yellow-100' :
                      'bg-purple-100'
                    }`}>
                      <i className={`${integration.icon} text-xl ${
                        integration.id === 'quickbooks' ? 'text-blue-600' :
                        integration.id === 'whatsapp' ? 'text-green-600' :
                        integration.id === 'sms_gateway' ? 'text-yellow-600' :
                        'text-purple-600'
                      }`}></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{integration.name}</h3>
                      <div className="flex items-center gap-2">
                        {getStatusIndicator(integration.status)}
                        {getStatusBadge(integration.status)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Integration Info */}
                <div className="mb-4">
                  <p className="text-gray-600 text-sm">{integration.description}</p>
                  {integration.lastSync && (
                    <p className="text-xs text-gray-500 mt-2">Last sync: {integration.lastSync}</p>
                  )}
                  {integration.error_message && (
                    <p className="text-xs text-red-500 mt-2">Error: {integration.error_message}</p>
                  )}
                </div>

                {/* Integration Actions */}
                <div className="flex items-center gap-2">
                  {integration.status === 'not-connected' ? (
                    integration.id === 'quickbooks' ? (
                      <button
                        onClick={handleQuickBooksConnect}
                        disabled={actionLoading === integration.id}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {actionLoading === integration.id ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                            Connecting...
                          </>
                        ) : (
                          'Connect QuickBooks'
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowConfigModal(integration.id)}
                        disabled={actionLoading === integration.id}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {actionLoading === integration.id ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                            Connecting...
                          </>
                        ) : (
                          'Connect'
                        )}
                      </button>
                    )
                  ) : (
                    <>
                      <button
                        onClick={() => setShowConfigModal(integration.id)}
                        disabled={actionLoading === integration.id}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Configure
                      </button>
                      {integration.id === 'quickbooks' && (
                        <button
                          onClick={handleQuickBooksSync}
                          disabled={syncingPayments}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {syncingPayments ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                              Syncing...
                            </>
                          ) : (
                            'Sync Payments'
                          )}
                        </button>
                      )}
                      {(integration.id === 'whatsapp' || integration.id === 'sms_gateway' || integration.id === 'email_service') && (
                        <button
                          onClick={() => handleTest(integration.id)}
                          disabled={actionLoading === integration.id}
                          className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {actionLoading === integration.id ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                              Testing...
                            </>
                          ) : (
                            'Send Test'
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => handleDisconnect(integration.id)}
                        disabled={actionLoading === integration.id}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {actionLoading === integration.id ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                            Disconnecting...
                          </>
                        ) : (
                          'Disconnect'
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QuickBooks Analytics Section */}
      {quickBooksSyncStatus?.connected && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">QuickBooks Payment Analytics</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowQuickBooksAnalytics(!showQuickBooksAnalytics)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  {showQuickBooksAnalytics ? 'Hide Analytics' : 'Show Analytics'}
                </button>
                <button
                  onClick={handleQuickBooksClearCache}
                  disabled={actionLoading === 'quickbooks'}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
                >
                  {actionLoading === 'quickbooks' ? 'Clearing...' : 'Clear Cache'}
                </button>
              </div>
            </div>
          </div>

          {showQuickBooksAnalytics && (
            <div className="p-6">
              {/* Sync Controls */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Days to Sync Back
                    </label>
                    <input
                      type="number"
                      value={daysBack}
                      onChange={(e) => setDaysBack(parseInt(e.target.value) || 30)}
                      min="1"
                      max="365"
                      className="border border-gray-300 rounded px-3 py-2 w-32"
                    />
                  </div>
                  <button
                    onClick={handleQuickBooksSync}
                    disabled={syncingPayments}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {syncingPayments ? 'Syncing...' : 'Sync Payments'}
                  </button>
                  <button
                    onClick={fetchQuickBooksAnalytics}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Refresh Analytics
                  </button>
                </div>
              </div>

              {/* Status Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">Connection Status</div>
                  <div className="text-lg font-bold text-blue-900">
                    {quickBooksSyncStatus.connected ? 'Connected' : 'Disconnected'}
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-600 font-medium">Last Sync</div>
                  <div className="text-lg font-bold text-green-900">
                    {formatDate(quickBooksSyncStatus.last_sync)}
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-sm text-purple-600 font-medium">Records Synced</div>
                  <div className="text-lg font-bold text-purple-900">
                    {quickBooksSyncStatus.records_synced || 0}
                  </div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-sm text-yellow-600 font-medium">Sync Status</div>
                  <div className="text-lg font-bold text-yellow-900">
                    {quickBooksSyncStatus.last_sync_success ? 'Success' : 'Failed'}
                  </div>
                </div>
              </div>

              {/* Analytics Data */}
              {quickBooksAnalytics ? (
                <div className="space-y-6">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white border border-gray-200 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">Total Payments</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {quickBooksAnalytics.summary.total_payments}
                      </div>
                    </div>
                    <div className="bg-white border border-gray-200 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">Total Amount</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {formatCurrency(quickBooksAnalytics.summary.total_amount)}
                      </div>
                    </div>
                    <div className="bg-white border border-gray-200 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">Average Payment</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {formatCurrency(quickBooksAnalytics.summary.average_payment)}
                      </div>
                    </div>
                    <div className="bg-white border border-gray-200 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">Last Updated</div>
                      <div className="text-lg font-bold text-gray-900">
                        {formatDate(quickBooksAnalytics.summary.sync_timestamp)}
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods Table */}
                  <div className="bg-white border border-gray-200 rounded-lg">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Payment Methods Breakdown</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Count</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {quickBooksAnalytics.payment_methods.map((method, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">{method.method}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{method.count}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(method.amount)}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{method.percentage.toFixed(1)}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Daily Trends */}
                  <div className="bg-white border border-gray-200 rounded-lg">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Daily Payment Trends</h3>
                    </div>
                    <div className="p-4">
                      <div className="space-y-2">
                        {quickBooksAnalytics.daily_trends.slice(0, 10).map((trend, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{trend.date}</span>
                            <span className="text-sm font-medium text-gray-900">{formatCurrency(trend.amount)}</span>
                          </div>
                        ))}
                        {quickBooksAnalytics.daily_trends.length > 10 && (
                          <div className="text-sm text-gray-500 text-center pt-2">
                            Showing last 10 days. Total: {quickBooksAnalytics.daily_trends.length} days
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-600">
                  <p>No analytics data available. Please sync payments to view analytics.</p>
                </div>
              )}

              {/* Error Display */}
              {quickBooksSyncStatus.error_message && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="text-sm text-red-800">
                    <strong>Error:</strong> {quickBooksSyncStatus.error_message}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Activity Logs Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Integration Activity Logs</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Integration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activityLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{log.datetime}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{log.integration}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{log.activity}</td>
                  <td className="px-6 py-4">{getStatusBadge(log.status)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Configuration Modals */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Configure {integrations.find(i => i.id === showConfigModal)?.name}
                </h2>
                <button
                  onClick={() => setShowConfigModal(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>
            <div className="p-6">
              {/* QuickBooks Configuration */}
              {showConfigModal === 'quickbooks' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Client ID</label>
                    <input
                      type="text"
                      placeholder="Enter QuickBooks Client ID"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={configForms.quickbooks.clientId}
                      onChange={(e) => setConfigForms(prev => ({
                        ...prev,
                        quickbooks: { ...prev.quickbooks, clientId: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Client Secret</label>
                    <input
                      type="password"
                      placeholder="Enter QuickBooks Client Secret"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={configForms.quickbooks.clientSecret}
                      onChange={(e) => setConfigForms(prev => ({
                        ...prev,
                        quickbooks: { ...prev.quickbooks, clientSecret: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Environment</label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={configForms.quickbooks.environment}
                      onChange={(e) => setConfigForms(prev => ({
                        ...prev,
                        quickbooks: { ...prev.quickbooks, environment: e.target.value }
                      }))}
                    >
                      <option value="sandbox">Sandbox</option>
                      <option value="production">Production</option>
                    </select>
                  </div>
                </div>
              )}

              {/* WhatsApp Configuration */}
              {showConfigModal === 'whatsapp' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Phone Number</label>
                    <input
                      type="text"
                      placeholder="Enter WhatsApp Phone Number"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={configForms.whatsapp.phoneNumber}
                      onChange={(e) => setConfigForms(prev => ({
                        ...prev,
                        whatsapp: { ...prev.whatsapp, phoneNumber: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                    <input
                      type="password"
                      placeholder="Enter WhatsApp API Key"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={configForms.whatsapp.apiKey}
                      onChange={(e) => setConfigForms(prev => ({
                        ...prev,
                        whatsapp: { ...prev.whatsapp, apiKey: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
                    <input
                      type="url"
                      placeholder="Enter Webhook URL"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={configForms.whatsapp.webhook}
                      onChange={(e) => setConfigForms(prev => ({
                        ...prev,
                        whatsapp: { ...prev.whatsapp, webhook: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              )}

              {/* SMS Gateway Configuration */}
              {showConfigModal === 'sms_gateway' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SMS Provider</label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={configForms.sms_gateway.provider}
                      onChange={(e) => setConfigForms(prev => ({
                        ...prev,
                        sms_gateway: { ...prev.sms_gateway, provider: e.target.value }
                      }))}
                    >
                      <option value="twilio">Twilio</option>
                      <option value="africastalking">Africa's Talking</option>
                      <option value="nexmo">Nexmo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                    <input
                      type="password"
                      placeholder="Enter SMS Gateway API Key"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={configForms.sms_gateway.apiKey}
                      onChange={(e) => setConfigForms(prev => ({
                        ...prev,
                        sms_gateway: { ...prev.sms_gateway, apiKey: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sender ID</label>
                    <input
                      type="text"
                      placeholder="Enter Sender ID"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={configForms.sms_gateway.senderId}
                      onChange={(e) => setConfigForms(prev => ({
                        ...prev,
                        sms_gateway: { ...prev.sms_gateway, senderId: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              )}

              {/* Email Configuration */}
              {showConfigModal === 'email_service' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
                    <input
                      type="text"
                      placeholder="Enter SMTP Host"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={configForms.email_service.smtpHost}
                      onChange={(e) => setConfigForms(prev => ({
                        ...prev,
                        email_service: { ...prev.email_service, smtpHost: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
                    <input
                      type="number"
                      placeholder="Enter SMTP Port"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={configForms.email_service.smtpPort}
                      onChange={(e) => setConfigForms(prev => ({
                        ...prev,
                        email_service: { ...prev.email_service, smtpPort: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                    <input
                      type="text"
                      placeholder="Enter Email Username"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={configForms.email_service.username}
                      onChange={(e) => setConfigForms(prev => ({
                        ...prev,
                        email_service: { ...prev.email_service, username: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input
                      type="password"
                      placeholder="Enter Email Password"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={configForms.email_service.password}
                      onChange={(e) => setConfigForms(prev => ({
                        ...prev,
                        email_service: { ...prev.email_service, password: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfigModal(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveConfig(showConfigModal)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Integrations; 