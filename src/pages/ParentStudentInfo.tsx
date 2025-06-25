import React from 'react';
import { useNavigate } from 'react-router-dom';
// import { useParentPortal } from '../contexts/parentPortalContext';

const ParentStudentInfo: React.FC = () => {
  // const { portalData } = useParentPortal();
  const navigate = useNavigate();

  // Placeholder: Replace with real parent/children data from context or API
  const parent = { 
    first_name: 'Jane', 
    last_name: 'Doe',
    email: 'jane.doe@email.com',
    phone: '0971112222'
  };
  
  const children = [
    { 
      first_name: 'Alice', 
      last_name: 'Doe', 
      student_id: 'S2024001', 
      grade: 'Grade 10',
      outstanding_fees: 2500.00,
      total_fees: 5000.00,
      last_payment: '2024-01-15',
      payment_status: 'Partial'
    },
    { 
      first_name: 'Bob', 
      last_name: 'Doe', 
      student_id: 'S2024002', 
      grade: 'Grade 8',
      outstanding_fees: 0.00,
      total_fees: 5000.00,
      last_payment: '2024-01-20',
      payment_status: 'Paid'
    }
  ];

  const totalOutstanding = children.reduce((sum, child) => sum + child.outstanding_fees, 0);
  const totalPaid = children.reduce((sum, child) => sum + (child.total_fees - child.outstanding_fees), 0);

  // Recent payments data
  const recentPayments = [
    { id: 1, student: 'Alice Doe', amount: 2500, date: '2024-01-15', method: 'Mobile Money', status: 'Completed' },
    { id: 2, student: 'Bob Doe', amount: 5000, date: '2024-01-20', method: 'Bank Transfer', status: 'Completed' },
    { id: 3, student: 'Alice Doe', amount: 300, date: '2024-01-10', method: 'Cash', status: 'Completed' }
  ];

  // Notifications
  const notifications = [
    { id: 1, type: 'payment', message: 'Payment of K2,500 received for Alice Doe', time: '2 hours ago', read: false },
    { id: 2, type: 'reminder', message: 'Reminder: Outstanding fees due for Alice Doe', time: '1 day ago', read: true },
    { id: 3, type: 'info', message: 'New fee structure available for 2024', time: '3 days ago', read: true }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'text-green-600 bg-green-100';
      case 'Partial': return 'text-yellow-600 bg-yellow-100';
      case 'Outstanding': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'payment': return 'fas fa-credit-card text-green-500';
      case 'reminder': return 'fas fa-bell text-yellow-500';
      case 'info': return 'fas fa-info-circle text-blue-500';
      default: return 'fas fa-circle text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Welcome Header */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <i className="fas fa-user text-2xl"></i>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {parent.first_name}!</h1>
              <p className="text-blue-100 mt-1">Here's what's happening with your children's education</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-200">Total Outstanding</div>
            <div className="text-4xl font-bold">K{totalOutstanding.toLocaleString()}</div>
            <div className="text-sm text-blue-200">Total Paid: K{totalPaid.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-users text-blue-600 text-xl"></i>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{children.length}</div>
              <div className="text-sm text-gray-500">Children</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-check-circle text-green-600 text-xl"></i>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {children.filter(c => c.outstanding_fees === 0).length}
              </div>
              <div className="text-sm text-gray-500">Fully Paid</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-exclamation-triangle text-yellow-600 text-xl"></i>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {children.filter(c => c.outstanding_fees > 0).length}
              </div>
              <div className="text-sm text-gray-500">Need Payment</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-bell text-purple-600 text-xl"></i>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {notifications.filter(n => !n.read).length}
              </div>
              <div className="text-sm text-gray-500">Notifications</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Children Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Your Children</h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {children.length} student{children.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="space-y-4">
              {children.map((child, index) => (
                <div key={child.student_id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-all duration-200 hover:shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md">
                        {child.first_name.charAt(0)}{child.last_name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {child.first_name} {child.last_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {child.student_id} • {child.grade}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Last payment: {child.last_payment}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-1">Outstanding</div>
                      <div className={`font-bold text-lg ${child.outstanding_fees > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        K{child.outstanding_fees.toLocaleString()}
                      </div>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(child.payment_status)}`}>
                        {child.payment_status}
                      </span>
                      {child.outstanding_fees > 0 && (
                        <button 
                          onClick={() => navigate('/parent-portal/pay')}
                          className="mt-2 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm font-medium shadow-sm"
                        >
                          Pay Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Parent Info Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <i className="fas fa-user-circle text-blue-600 mr-2"></i>
              Your Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">Full Name</label>
                <p className="text-gray-900 font-medium">{parent.first_name} {parent.last_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{parent.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Phone</label>
                <p className="text-gray-900">{parent.phone}</p>
              </div>
              <button 
                onClick={() => navigate('/parent-portal/update')}
                className="w-full mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center"
              >
                <i className="fas fa-edit mr-2"></i>
                Update Information
              </button>
            </div>
          </div>

          {/* Recent Payments */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <i className="fas fa-history text-green-600 mr-2"></i>
              Recent Payments
            </h3>
            <div className="space-y-3">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{payment.student}</div>
                    <div className="text-sm text-gray-500">{payment.method} • {payment.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">K{payment.amount.toLocaleString()}</div>
                    <div className="text-xs text-green-500">{payment.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <i className="fas fa-bell text-purple-600 mr-2"></i>
              Notifications
            </h3>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div key={notification.id} className={`p-3 rounded-lg ${notification.read ? 'bg-gray-50' : 'bg-blue-50 border-l-4 border-blue-500'}`}>
                  <div className="flex items-start space-x-3">
                    <i className={`${getNotificationIcon(notification.type)} mt-1`}></i>
                    <div className="flex-1">
                      <div className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                        {notification.message}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{notification.time}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button 
            onClick={() => navigate('/parent-portal/pay')}
            className="flex items-center justify-center p-6 border-2 border-blue-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 group"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-200 shadow-lg">
                <i className="fas fa-credit-card text-white text-2xl"></i>
              </div>
              <div className="font-semibold text-gray-900">Make Payment</div>
              <div className="text-sm text-gray-500">Pay outstanding fees</div>
            </div>
          </button>
          
          <button 
            onClick={() => navigate('/parent-portal/update')}
            className="flex items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 group"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:from-gray-600 group-hover:to-gray-700 transition-all duration-200 shadow-lg">
                <i className="fas fa-user-edit text-white text-2xl"></i>
              </div>
              <div className="font-semibold text-gray-900">Update Profile</div>
              <div className="text-sm text-gray-500">Edit your information</div>
            </div>
          </button>
          
          <button 
            onClick={() => navigate('/parent-portal/delete')}
            className="flex items-center justify-center p-6 border-2 border-red-200 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all duration-200 group"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:from-red-600 group-hover:to-red-700 transition-all duration-200 shadow-lg">
                <i className="fas fa-trash text-white text-2xl"></i>
              </div>
              <div className="font-semibold text-gray-900">Delete Account</div>
              <div className="text-sm text-gray-500">Remove your account</div>
            </div>
          </button>

          <button 
            onClick={() => window.print()}
            className="flex items-center justify-center p-6 border-2 border-green-200 rounded-xl hover:bg-green-50 hover:border-green-300 transition-all duration-200 group"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:from-green-600 group-hover:to-green-700 transition-all duration-200 shadow-lg">
                <i className="fas fa-print text-white text-2xl"></i>
              </div>
              <div className="font-semibold text-gray-900">Print Statement</div>
              <div className="text-sm text-gray-500">Download records</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParentStudentInfo; 