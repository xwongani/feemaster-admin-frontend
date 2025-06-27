import React from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';

const PaymentSuccess: React.FC = () => {
  const { logDataAction } = useAnalytics();

  React.useEffect(() => {
    logDataAction('view', 'payment_success', 'payment_success');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg mb-6">
            <i className="fas fa-check text-white text-2xl" aria-hidden="true"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">Your payment has been processed successfully</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <p className="text-gray-600 mb-6">
            Thank you for your payment. You will receive a confirmation email shortly.
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

export default PaymentSuccess; 