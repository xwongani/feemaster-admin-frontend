import React from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';

const PaymentCancel: React.FC = () => {
  const { logDataAction } = useAnalytics();

  React.useEffect(() => {
    logDataAction('Payment Cancel');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg mb-6">
            <i className="fas fa-times text-white text-2xl" aria-hidden="true"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
          <p className="text-gray-600">Your payment was cancelled</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <p className="text-gray-600 mb-6">
            No charges were made to your account. You can try again anytime.
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

export default PaymentCancel; 