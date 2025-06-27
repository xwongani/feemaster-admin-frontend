import React from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useAuth } from '../../contexts/AuthContext';

const ParentDashboard: React.FC = () => {
  const { logDataAction } = useAnalytics();
  const { user, logout } = useAuth();

  React.useEffect(() => {
    logDataAction('view', 'parent_dashboard', 'parent_dashboard');
  }, []);

  const handleLogout = () => {
    logDataAction('view', 'parent_logout', 'parent_logout');
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Parent Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user?.first_name} {user?.last_name}</span>
              <button
                onClick={handleLogout}
                className="secondary-btn"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="mx-auto h-24 w-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-lg mb-8">
            <i className="fas fa-users text-white text-4xl" aria-hidden="true"></i>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Parent Dashboard</h2>
          <p className="text-xl text-gray-600 mb-8">
            Welcome to your FeeMaster parent portal. This dashboard is under development.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <i className="fas fa-child text-blue-600 text-xl" aria-hidden="true"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">My Children</h3>
              <p className="text-gray-600 text-sm">View and manage your children's information</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <i className="fas fa-dollar-sign text-green-600 text-xl" aria-hidden="true"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fee Payments</h3>
              <p className="text-gray-600 text-sm">View and make fee payments</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <i className="fas fa-bell text-purple-600 text-xl" aria-hidden="true"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Notifications</h3>
              <p className="text-gray-600 text-sm">Stay updated with important announcements</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard; 