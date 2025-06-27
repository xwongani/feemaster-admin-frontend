import React from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';

const ParentFees: React.FC = () => {
  const { logDataAction } = useAnalytics();

  React.useEffect(() => {
    logDataAction('Parent Fees');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
            <i className="fas fa-dollar-sign text-white text-2xl" aria-hidden="true"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Fee Overview</h1>
          <p className="text-gray-600">View your children's fee details</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <p className="text-gray-600 mb-6">
            This page is under development. Fee management will be available soon.
          </p>
          
          <button
            onClick={() => window.location.href = '/parent/dashboard'}
            className="w-full primary-btn"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParentFees; 