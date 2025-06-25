import React from 'react';
import { Link } from 'react-router-dom';
import { useParentPortal } from '../contexts/parentPortalContext';

const ParentPaymentConfirmation: React.FC = () => {
  const { portalData } = useParentPortal();
  
  if (!portalData) return <div>No data found. Please start from the lookup page.</div>;
  
  const { student, outstanding_fees } = portalData;
  const total = outstanding_fees.reduce((sum: number, fee: any) => sum + Number(fee.amount), 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZM', {
      style: 'currency',
      currency: 'ZMW',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-4 sm:py-6 lg:py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-check text-white text-2xl sm:text-3xl"></i>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-sm sm:text-base text-gray-600">Your payment has been processed successfully</p>
        </div>

        {/* Payment Receipt */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-4 sm:mb-6">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 sm:px-6 py-3 sm:py-4">
            <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
              <i className="fas fa-receipt text-sm sm:text-base"></i>
              Payment Receipt
            </h2>
          </div>
          
          <div className="p-4 sm:p-6">
            {/* Student Info */}
            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-user text-blue-600 text-lg sm:text-xl"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{student.first_name} {student.last_name}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">Student ID: {student.student_id}</p>
                  <p className="text-gray-600 text-xs sm:text-sm">Class: {student.grade}</p>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 sm:py-3 border-b border-gray-100">
                <span className="text-gray-600 text-sm sm:text-base">Transaction ID:</span>
                <span className="font-mono font-semibold text-gray-900 text-sm sm:text-base">TXN-{Date.now().toString().slice(-8)}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 sm:py-3 border-b border-gray-100">
                <span className="text-gray-600 text-sm sm:text-base">Payment Date:</span>
                <span className="font-semibold text-gray-900 text-sm sm:text-base">{new Date().toLocaleDateString('en-ZM', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 sm:py-3 border-b border-gray-100">
                <span className="text-gray-600 text-sm sm:text-base">Payment Method:</span>
                <span className="text-gray-900 text-sm sm:text-base">TUMENY Mobile Money</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 sm:py-3 border-b border-gray-100">
                <span className="text-gray-600 text-sm sm:text-base">Status:</span>
                <span className="bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                  Completed
                </span>
              </div>
            </div>

            {/* Amount Paid */}
            <div className="bg-green-50 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
              <p className="text-sm text-green-600 mb-1">Amount Paid</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-700">{formatCurrency(total)}</p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">What's Next?</h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
                <span className="text-blue-600 font-semibold text-xs sm:text-sm">1</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm sm:text-base">Email Receipt</h4>
                <p className="text-xs sm:text-sm text-gray-600">A detailed receipt has been sent to your registered email address.</p>
              </div>
            </div>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
                <span className="text-blue-600 font-semibold text-xs sm:text-sm">2</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm sm:text-base">SMS Confirmation</h4>
                <p className="text-xs sm:text-sm text-gray-600">You will receive an SMS confirmation within the next few minutes.</p>
              </div>
            </div>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
                <span className="text-blue-600 font-semibold text-xs sm:text-sm">3</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm sm:text-base">Account Update</h4>
                <p className="text-xs sm:text-sm text-gray-600">Your student's account has been updated with the payment information.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link
            to="/parent-portal"
            className="flex-1 bg-blue-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold text-center hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <i className="fas fa-home text-sm sm:text-base"></i>
            <span className="text-sm sm:text-base">Return to Dashboard</span>
          </Link>
          <button
            onClick={() => window.print()}
            className="flex-1 bg-gray-100 text-gray-700 py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <i className="fas fa-print text-sm sm:text-base"></i>
            <span className="text-sm sm:text-base">Print Receipt</span>
          </button>
        </div>

        {/* Contact Information */}
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-xs sm:text-sm text-gray-600 mb-2">Need help? Contact us:</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 text-xs sm:text-sm">
            <span className="text-gray-600 flex items-center justify-center gap-1">
              <i className="fas fa-phone"></i>
              +260 955 123 456
            </span>
            <span className="text-gray-600 flex items-center justify-center gap-1">
              <i className="fas fa-envelope"></i>
              payments@school.com
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentPaymentConfirmation; 