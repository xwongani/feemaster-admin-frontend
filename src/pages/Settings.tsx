import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    schoolName: '',
    schoolEmail: '',
    schoolPhone: '',
    schoolAddress: '',
    currentTermStart: '',
    currentTermEnd: '',
    academicYear: '',
    currentTerm: '',
    language: 'en',
    timezone: 'Africa/Lusaka',
    dateFormat: 'DD/MM/YYYY',
    currency: 'ZMW',
    enableEmailNotifications: true,
    enableSMSNotifications: true
  });

  // Payment Settings State
  const [paymentSettings, setPaymentSettings] = useState({
    acceptCash: true,
    acceptBankTransfer: true,
    acceptMobileMoney: true,
    acceptCreditCard: false,
    lateFeePercentage: '5',
    gracePeriodDays: '7',
    autoReminders: true,
    reminderFrequency: '7'
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailReminders: true,
    smsReminders: true,
    paymentConfirmations: true,
    overdueNotifications: true,
    systemAlerts: true,
    reportNotifications: false
  });

  // Users & Permissions State
  const [users, setUsers] = useState<User[]>([]);

  // Backup Settings State
  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    retentionDays: '30',
    backupLocation: 'cloud',
    lastBackup: ''
  });

  // Appearance Settings State
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    primaryColor: '#3B82F6',
    sidebar: 'expanded',
    compactMode: false
  });

  // System Settings State
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    debugMode: false,
    sessionTimeout: '30',
    maxLoginAttempts: '5',
    dataRetentionYears: '7'
  });

  const API_BASE_URL = (window as any).REACT_APP_API_BASE_URL || 'http://localhost:8000/api/v1';

  useEffect(() => {
    fetchSettings();
  }, [activeTab]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      let endpoint = '';
      switch (activeTab) {
        case 'general':
          endpoint = '/settings/general';
          break;
        case 'payment':
          endpoint = '/settings/payment-options';
          break;
        case 'notification':
          endpoint = '/settings/notifications';
          break;
        case 'users':
          endpoint = '/settings/users';
          break;
        case 'backup':
          endpoint = '/settings/backup';
          break;
        case 'appearance':
          endpoint = '/settings/appearance';
          break;
        case 'system':
          endpoint = '/settings/system';
          break;
        default:
          return;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        switch (activeTab) {
          case 'general':
            setGeneralSettings({
              schoolName: result.data.school_name || '',
              schoolEmail: result.data.school_email || '',
              schoolPhone: result.data.school_phone || '',
              schoolAddress: result.data.school_address || '',
              currentTermStart: result.data.current_term_start || '',
              currentTermEnd: result.data.current_term_end || '',
              academicYear: result.data.academic_year || '',
              currentTerm: result.data.current_term || '',
              language: result.data.language || 'en',
              timezone: result.data.timezone || 'Africa/Lusaka',
              dateFormat: result.data.date_format || 'DD/MM/YYYY',
              currency: result.data.currency || 'ZMW',
              enableEmailNotifications: result.data.enable_email_notifications !== false,
              enableSMSNotifications: result.data.enable_sms_notifications !== false
            });
            break;
          case 'payment':
            setPaymentSettings({
              acceptCash: result.data.accept_cash !== false,
              acceptBankTransfer: result.data.accept_bank_transfer !== false,
              acceptMobileMoney: result.data.accept_mobile_money !== false,
              acceptCreditCard: result.data.accept_credit_card === true,
              lateFeePercentage: String(result.data.late_fee_percentage || 5),
              gracePeriodDays: String(result.data.grace_period_days || 7),
              autoReminders: result.data.auto_reminders !== false,
              reminderFrequency: result.data.reminder_frequency || 'weekly'
            });
            break;
          case 'notification':
            setNotificationSettings({
              emailReminders: result.data.email_notifications !== false,
              smsReminders: result.data.sms_notifications !== false,
              paymentConfirmations: result.data.payment_confirmations !== false,
              overdueNotifications: result.data.overdue_notifications !== false,
              systemAlerts: result.data.system_alerts !== false,
              reportNotifications: result.data.report_notifications === true
            });
            break;
          case 'users':
            setUsers(result.data || []);
            break;
          case 'backup':
            setBackupSettings({
              autoBackup: result.data.auto_backup !== false,
              backupFrequency: result.data.backup_frequency || 'daily',
              retentionDays: String(result.data.retention_days || 30),
              backupLocation: result.data.backup_location || 'cloud',
              lastBackup: result.data.last_backup || ''
            });
            break;
          case 'appearance':
            setAppearanceSettings({
              theme: result.data.theme || 'light',
              primaryColor: result.data.primary_color || '#3B82F6',
              sidebar: result.data.sidebar || 'expanded',
              compactMode: result.data.compact_mode === true
            });
            break;
          case 'system':
            setSystemSettings({
              maintenanceMode: result.data.maintenance_mode === true,
              debugMode: result.data.debug_mode === true,
              sessionTimeout: String(result.data.session_timeout || 30),
              maxLoginAttempts: String(result.data.max_login_attempts || 5),
              dataRetentionYears: String(result.data.data_retention_years || 7)
            });
            break;
        }
      } else {
        throw new Error(result.message || 'Failed to fetch settings');
      }
    } catch (err) {
      console.error(`Error fetching ${activeTab} settings:`, err);
      setError(`Failed to load ${activeTab} settings. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setError(null);

      let endpoint = '';
      let data = {};

      switch (activeTab) {
        case 'general':
          endpoint = '/settings/general';
          data = {
            school_name: generalSettings.schoolName,
            school_email: generalSettings.schoolEmail,
            school_phone: generalSettings.schoolPhone,
            school_address: generalSettings.schoolAddress,
            current_term_start: generalSettings.currentTermStart,
            current_term_end: generalSettings.currentTermEnd,
            academic_year: generalSettings.academicYear,
            current_term: generalSettings.currentTerm,
            language: generalSettings.language,
            timezone: generalSettings.timezone,
            date_format: generalSettings.dateFormat,
            currency: generalSettings.currency,
            enable_email_notifications: generalSettings.enableEmailNotifications,
            enable_sms_notifications: generalSettings.enableSMSNotifications
          };
          break;
        case 'payment':
          endpoint = '/settings/payment-options';
          data = {
            accept_cash: paymentSettings.acceptCash,
            accept_bank_transfer: paymentSettings.acceptBankTransfer,
            accept_mobile_money: paymentSettings.acceptMobileMoney,
            accept_credit_card: paymentSettings.acceptCreditCard,
            late_fee_percentage: parseFloat(paymentSettings.lateFeePercentage),
            grace_period_days: parseInt(paymentSettings.gracePeriodDays),
            auto_reminders: paymentSettings.autoReminders,
            reminder_frequency: paymentSettings.reminderFrequency
          };
          break;
        case 'notification':
          endpoint = '/settings/notifications';
          data = {
            email_notifications: notificationSettings.emailReminders,
            sms_notifications: notificationSettings.smsReminders,
            payment_confirmations: notificationSettings.paymentConfirmations,
            overdue_notifications: notificationSettings.overdueNotifications,
            system_alerts: notificationSettings.systemAlerts,
            report_notifications: notificationSettings.reportNotifications
          };
          break;
        case 'backup':
          endpoint = '/settings/backup';
          data = {
            auto_backup: backupSettings.autoBackup,
            backup_frequency: backupSettings.backupFrequency,
            retention_days: parseInt(backupSettings.retentionDays),
            backup_location: backupSettings.backupLocation
          };
          break;
        case 'appearance':
          endpoint = '/settings/appearance';
          data = {
            theme: appearanceSettings.theme,
            primary_color: appearanceSettings.primaryColor,
            sidebar: appearanceSettings.sidebar,
            compact_mode: appearanceSettings.compactMode
          };
          break;
        case 'system':
          endpoint = '/settings/system';
          data = {
            maintenance_mode: systemSettings.maintenanceMode,
            debug_mode: systemSettings.debugMode,
            session_timeout: parseInt(systemSettings.sessionTimeout),
            max_login_attempts: parseInt(systemSettings.maxLoginAttempts),
            data_retention_years: parseInt(systemSettings.dataRetentionYears)
          };
          break;
        default:
          return;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setHasUnsavedChanges(false);
        // Show success message - you can implement a toast notification here
        alert('Settings saved successfully!');
      } else {
        throw new Error(result.message || 'Failed to save settings');
      }
    } catch (err) {
      console.error(`Error saving ${activeTab} settings:`, err);
      setError(`Failed to save ${activeTab} settings. Please try again.`);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General Settings', icon: 'fas fa-sliders-h' },
    { id: 'payment', label: 'Payment Options', icon: 'fas fa-money-check-alt' },
    { id: 'notification', label: 'Notifications', icon: 'fas fa-bell' },
    { id: 'users', label: 'Users & Permissions', icon: 'fas fa-users-cog' },
    { id: 'backup', label: 'Backup & Data', icon: 'fas fa-database' },
    { id: 'appearance', label: 'Appearance', icon: 'fas fa-palette' },
    { id: 'system', label: 'System', icon: 'fas fa-server' }
  ];

  const updateGeneralSettings = (field: string, value: any) => {
    setGeneralSettings(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const updatePaymentSettings = (field: string, value: any) => {
    setPaymentSettings(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const updateNotificationSettings = (field: string, value: any) => {
    setNotificationSettings(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const updateBackupSettings = (field: string, value: any) => {
    setBackupSettings(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const updateAppearanceSettings = (field: string, value: any) => {
    setAppearanceSettings(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const updateSystemSettings = (field: string, value: any) => {
    setSystemSettings(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <i className="fas fa-cog"></i>
              Settings
            </h1>
            <p className="text-gray-600">Configure your Fee Master application settings.</p>
          </div>
          <div className="flex items-center gap-3">
            {hasUnsavedChanges && (
              <span className="text-sm text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full">
                <i className="fas fa-exclamation-triangle mr-1"></i>
                Unsaved changes
              </span>
            )}
            <button 
              onClick={handleSaveSettings}
              disabled={saving || loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  Save Changes
                </>
              )}
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4">
              <div className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    disabled={loading}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <i className={tab.icon}></i>
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            
            {/* Loading State */}
            {loading && (
              <div className="p-6 text-center">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Loading {tabs.find(t => t.id === activeTab)?.label.toLowerCase()}...</span>
                </div>
              </div>
            )}
            
            {/* Content when not loading */}
            {!loading && (
              <>
                {/* General Settings */}
                {activeTab === 'general' && (
                  <div className="p-6">
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-gray-900">General Settings</h2>
                      <p className="text-gray-600">Configure your Fee Master general application settings</p>
                    </div>

                    {/* School Information */}
                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">School Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">School Name</label>
                          <input
                            type="text"
                            value={generalSettings.schoolName}
                            onChange={(e) => updateGeneralSettings('schoolName', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input
                              type="email"
                              value={generalSettings.schoolEmail}
                              onChange={(e) => updateGeneralSettings('schoolEmail', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <input
                              type="tel"
                              value={generalSettings.schoolPhone}
                              onChange={(e) => updateGeneralSettings('schoolPhone', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                          <textarea
                            rows={3}
                            value={generalSettings.schoolAddress}
                            onChange={(e) => updateGeneralSettings('schoolAddress', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Academic Calendar */}
                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Academic Calendar</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Current Term Start Date</label>
                          <input
                            type="date"
                            value={generalSettings.currentTermStart}
                            onChange={(e) => updateGeneralSettings('currentTermStart', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Current Term End Date</label>
                          <input
                            type="date"
                            value={generalSettings.currentTermEnd}
                            onChange={(e) => updateGeneralSettings('currentTermEnd', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
                          <select
                            value={generalSettings.academicYear}
                            onChange={(e) => updateGeneralSettings('academicYear', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                            <option value="2022">2022</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Current Term</label>
                          <select
                            value={generalSettings.currentTerm}
                            onChange={(e) => updateGeneralSettings('currentTerm', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="1">Term 1</option>
                            <option value="2">Term 2</option>
                            <option value="3">Term 3</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* System Preferences */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">System Preferences</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Default Language</label>
                            <select
                              value={generalSettings.language}
                              onChange={(e) => updateGeneralSettings('language', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="en">English</option>
                              <option value="fr">French</option>
                              <option value="es">Spanish</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                            <select
                              value={generalSettings.timezone}
                              onChange={(e) => updateGeneralSettings('timezone', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="Africa/Lusaka">Africa/Lusaka (GMT+2)</option>
                              <option value="UTC">UTC (GMT+0)</option>
                              <option value="America/New_York">America/New_York (GMT-5)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                            <select
                              value={generalSettings.dateFormat}
                              onChange={(e) => updateGeneralSettings('dateFormat', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                            <select
                              value={generalSettings.currency}
                              onChange={(e) => updateGeneralSettings('currency', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="ZMW">Zambian Kwacha (K)</option>
                              <option value="USD">US Dollar ($)</option>
                              <option value="EUR">Euro (€)</option>
                            </select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={generalSettings.enableEmailNotifications}
                              onChange={(e) => updateGeneralSettings('enableEmailNotifications', e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Enable Email Notifications</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={generalSettings.enableSMSNotifications}
                              onChange={(e) => updateGeneralSettings('enableSMSNotifications', e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Enable SMS Notifications</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Options */}
                {activeTab === 'payment' && (
                  <div className="p-6">
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Payment Options</h2>
                      <p className="text-gray-600">Configure payment methods and settings</p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Accepted Payment Methods</h3>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={paymentSettings.acceptCash}
                              onChange={(e) => updatePaymentSettings('acceptCash', e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Cash Payments</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={paymentSettings.acceptBankTransfer}
                              onChange={(e) => updatePaymentSettings('acceptBankTransfer', e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Bank Transfer</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={paymentSettings.acceptMobileMoney}
                              onChange={(e) => updatePaymentSettings('acceptMobileMoney', e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Mobile Money</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={paymentSettings.acceptCreditCard}
                              onChange={(e) => updatePaymentSettings('acceptCreditCard', e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Credit/Debit Cards</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Policies</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Late Fee Percentage</label>
                            <input
                              type="number"
                              value={paymentSettings.lateFeePercentage}
                              onChange={(e) => updatePaymentSettings('lateFeePercentage', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              min="0"
                              max="100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Grace Period (Days)</label>
                            <input
                              type="number"
                              value={paymentSettings.gracePeriodDays}
                              onChange={(e) => updatePaymentSettings('gracePeriodDays', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              min="0"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Reminder Settings</h3>
                        <label className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            checked={paymentSettings.autoReminders}
                            onChange={(e) => updatePaymentSettings('autoReminders', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Enable Automatic Reminders</span>
                        </label>
                        {paymentSettings.autoReminders && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Frequency (Days)</label>
                            <input
                              type="number"
                              value={paymentSettings.reminderFrequency}
                              onChange={(e) => updatePaymentSettings('reminderFrequency', e.target.value)}
                              className="w-full max-w-xs border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              min="1"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications */}
                {activeTab === 'notification' && (
                  <div className="p-6">
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Notification Settings</h2>
                      <p className="text-gray-600">Configure when and how you receive notifications</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={notificationSettings.emailReminders}
                              onChange={(e) => updateNotificationSettings('emailReminders', e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Payment Reminders</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={notificationSettings.paymentConfirmations}
                              onChange={(e) => updateNotificationSettings('paymentConfirmations', e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Payment Confirmations</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={notificationSettings.overdueNotifications}
                              onChange={(e) => updateNotificationSettings('overdueNotifications', e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Overdue Notifications</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={notificationSettings.systemAlerts}
                              onChange={(e) => updateNotificationSettings('systemAlerts', e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">System Alerts</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={notificationSettings.reportNotifications}
                              onChange={(e) => updateNotificationSettings('reportNotifications', e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Report Notifications</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">SMS Notifications</h3>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={notificationSettings.smsReminders}
                            onChange={(e) => updateNotificationSettings('smsReminders', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">SMS Payment Reminders</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Users & Permissions */}
                {activeTab === 'users' && (
                  <div className="p-6">
                    <div className="mb-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">Users & Permissions</h2>
                          <p className="text-gray-600">Manage system users and their access levels</p>
                        </div>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                          <i className="fas fa-plus"></i>
                          Add User
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {users.map((user) => (
                            <tr key={user.id}>
                              <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                              <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                              <td className="px-6 py-4 text-sm text-gray-900">{user.role}</td>
                              <td className="px-6 py-4">
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                  {user.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm font-medium">
                                <div className="flex items-center gap-2">
                                  <button className="text-blue-600 hover:text-blue-900">
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button className="text-red-600 hover:text-red-900">
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Backup & Data */}
                {activeTab === 'backup' && (
                  <div className="p-6">
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Backup & Data</h2>
                      <p className="text-gray-600">Configure data backup and retention settings</p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Automatic Backup</h3>
                        <label className="flex items-center mb-4">
                          <input
                            type="checkbox"
                            checked={backupSettings.autoBackup}
                            onChange={(e) => updateBackupSettings('autoBackup', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Enable Automatic Backup</span>
                        </label>
                        
                        {backupSettings.autoBackup && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
                              <select
                                value={backupSettings.backupFrequency}
                                onChange={(e) => updateBackupSettings('backupFrequency', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Retention Period (Days)</label>
                              <input
                                type="number"
                                value={backupSettings.retentionDays}
                                onChange={(e) => updateBackupSettings('retentionDays', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                min="1"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Backup Information</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600 mb-2">Last Backup: {backupSettings.lastBackup}</p>
                          <div className="flex gap-3">
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                              <i className="fas fa-database mr-2"></i>
                              Backup Now
                            </button>
                            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm">
                              <i className="fas fa-download mr-2"></i>
                              Download Backup
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Appearance */}
                {activeTab === 'appearance' && (
                  <div className="p-6">
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Appearance</h2>
                      <p className="text-gray-600">Customize the look and feel of your application</p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Theme</h3>
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="theme"
                              value="light"
                              checked={appearanceSettings.theme === 'light'}
                              onChange={(e) => updateAppearanceSettings('theme', e.target.value)}
                              className="text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Light</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="theme"
                              value="dark"
                              checked={appearanceSettings.theme === 'dark'}
                              onChange={(e) => updateAppearanceSettings('theme', e.target.value)}
                              className="text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Dark</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Layout</h3>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={appearanceSettings.compactMode}
                            onChange={(e) => updateAppearanceSettings('compactMode', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Compact Mode</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* System */}
                {activeTab === 'system' && (
                  <div className="p-6">
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-gray-900">System Settings</h2>
                      <p className="text-gray-600">Configure system-level settings and maintenance</p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">System Status</h3>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={systemSettings.maintenanceMode}
                            onChange={(e) => updateSystemSettings('maintenanceMode', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Maintenance Mode</span>
                        </label>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (Minutes)</label>
                            <input
                              type="number"
                              value={systemSettings.sessionTimeout}
                              onChange={(e) => updateSystemSettings('sessionTimeout', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              min="1"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
                            <input
                              type="number"
                              value={systemSettings.maxLoginAttempts}
                              onChange={(e) => updateSystemSettings('maxLoginAttempts', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              min="1"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Data Retention</h3>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Data Retention Period (Years)</label>
                          <input
                            type="number"
                            value={systemSettings.dataRetentionYears}
                            onChange={(e) => updateSystemSettings('dataRetentionYears', e.target.value)}
                            className="w-full max-w-xs border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min="1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 