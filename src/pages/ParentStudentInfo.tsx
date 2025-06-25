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
      total_fees: 5000.00
    },
    { 
      first_name: 'Bob', 
      last_name: 'Doe', 
      student_id: 'S2024002', 
      grade: 'Grade 8',
      outstanding_fees: 0.00,
      total_fees: 5000.00
    }
  ];

  const totalOutstanding = children.reduce((sum, child) => sum + child.outstanding_fees, 0);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {parent.first_name}!</h1>
            <p className="text-blue-100 mt-1">Manage your children's education and payments</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-200">Total Outstanding</div>
            <div className="text-3xl font-bold">K{totalOutstanding.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Parent Info Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Parent Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Full Name</label>
            <p className="text-gray-900">{parent.first_name} {parent.last_name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Email</label>
            <p className="text-gray-900">{parent.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Phone</label>
            <p className="text-gray-900">{parent.phone}</p>
          </div>
          <div className="flex items-end">
            <button 
              onClick={() => navigate('/parent-portal/update')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Update Information →
            </button>
          </div>
        </div>
      </div>

      {/* Children Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Your Children</h2>
          <span className="text-sm text-gray-500">{children.length} student{children.length !== 1 ? 's' : ''}</span>
        </div>
        
        <div className="space-y-4">
          {children.map((child, index) => (
            <div key={child.student_id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-lg">
                      {child.first_name.charAt(0)}{child.last_name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {child.first_name} {child.last_name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {child.student_id} • {child.grade}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Outstanding</div>
                  <div className={`font-semibold ${child.outstanding_fees > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    K{child.outstanding_fees.toLocaleString()}
                  </div>
                  {child.outstanding_fees > 0 && (
                    <button 
                      onClick={() => navigate('/parent-portal/pay')}
                      className="mt-2 text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
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

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate('/parent-portal/pay')}
            className="flex items-center justify-center p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors group"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-blue-200 transition-colors">
                <i className="fas fa-credit-card text-blue-600 text-xl"></i>
              </div>
              <div className="font-medium text-gray-900">Make Payment</div>
              <div className="text-sm text-gray-500">Pay outstanding fees</div>
            </div>
          </button>
          
          <button 
            onClick={() => navigate('/parent-portal/update')}
            className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-gray-200 transition-colors">
                <i className="fas fa-user-edit text-gray-600 text-xl"></i>
              </div>
              <div className="font-medium text-gray-900">Update Profile</div>
              <div className="text-sm text-gray-500">Edit your information</div>
            </div>
          </button>
          
          <button 
            onClick={() => navigate('/parent-portal/delete')}
            className="flex items-center justify-center p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors group"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-red-200 transition-colors">
                <i className="fas fa-trash text-red-600 text-xl"></i>
              </div>
              <div className="font-medium text-gray-900">Delete Account</div>
              <div className="text-sm text-gray-500">Remove your account</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParentStudentInfo; 