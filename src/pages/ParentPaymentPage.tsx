import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParentPortal } from '../contexts/parentPortalContext';
import { makePayment } from '../services/parentPortalApi';
import { paymentGateway, PAYMENT_METHODS } from '../services/paymentGatewayService';

const ParentPaymentPage: React.FC = () => {
  const { portalData } = useParentPortal();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('tumeny');
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  if (!portalData) return <div>No data found. Please start from the lookup page.</div>;
  const { student, outstanding_fees } = portalData;
  const total = outstanding_fees.reduce((sum: number, fee: any) => sum + Number(fee.amount), 0);

  // Get available payment methods from service
  const availablePaymentMethods = paymentGateway.getPaymentMethods();
  
  // Calculate fees for selected method
  const fees = paymentGateway.calculateFees(total, selectedPaymentMethod);
  const totalWithFees = total + fees;

  const handlePayment = async () => {
    setLoading(true);
    setError('');
    try {
      // Use payment gateway service
      const paymentRequest = {
        amount: total,
        currency: 'ZMW',
        studentId: student.id,
        studentName: `${student.first_name} ${student.last_name}`,
        paymentMethod: selectedPaymentMethod,
        paymentType: 'Tuition Fee',
        description: `Payment for ${student.first_name} ${student.last_name} - ${student.student_id}`,
        metadata: {
          outstanding_fees: outstanding_fees.map((fee: any) => ({ 
            student_fee_id: fee.id, 
            amount: fee.amount 
          }))
        }
      };

      const result = await paymentGateway.processPayment(paymentRequest);
      
      if (result.success) {
        navigate('/parent-portal/confirmation');
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return paymentGateway.formatCurrency(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-6 lg:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Payment Gateway</h1>
          <p className="text-sm sm:text-base text-gray-600">Complete your fee payment securely</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Payment Summary */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 py-3 sm:py-4">
                <h2 className="text-lg sm:text-xl font-semibold text-white">Payment Summary</h2>
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

                {/* Outstanding Fees */}
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Outstanding Fees</h3>
                  <div className="space-y-2 sm:space-y-3">
                    {outstanding_fees.map((fee: any, index: number) => (
                      <div key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-gray-50 rounded-lg gap-2 sm:gap-0">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{fee.fee_type || 'Tuition Fee'}</p>
                          <p className="text-xs sm:text-sm text-gray-600">Due: {new Date(fee.due_date).toLocaleDateString()}</p>
                        </div>
                        <span className="font-semibold text-gray-900 text-sm sm:text-base">{formatCurrency(fee.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Breakdown */}
                <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Payment Breakdown</h3>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm sm:text-base">Subtotal:</span>
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">{formatCurrency(total)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm sm:text-base">Processing Fee:</span>
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">{formatCurrency(fees)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 sm:pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-base sm:text-lg font-semibold text-gray-900">Total Amount:</span>
                        <span className="text-xl sm:text-2xl font-bold text-blue-600">{formatCurrency(totalWithFees)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 sm:px-6 py-3 sm:py-4">
                <h2 className="text-lg sm:text-xl font-semibold text-white">Payment Method</h2>
              </div>
              
              <div className="p-4 sm:p-6">
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  {availablePaymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`relative cursor-pointer rounded-lg sm:rounded-xl border-2 p-3 sm:p-4 transition-all duration-200 ${
                        selectedPaymentMethod === method.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                    >
                      {method.popular && (
                        <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-orange-500 text-white text-xs px-1 sm:px-2 py-1 rounded-full">
                          Popular
                        </div>
                      )}
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 ${method.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <i className={`${method.icon} text-white text-sm sm:text-base`}></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{method.name}</h3>
                          <p className="text-xs sm:text-sm text-gray-600 truncate">{method.description}</p>
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            Processing: {method.processingTime} • Fee: {method.fees.percentage > 0 ? `${method.fees.percentage}%` : 'Free'}
                          </p>
                        </div>
                        <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          selectedPaymentMethod === method.id
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedPaymentMethod === method.id && (
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Payment Button */}
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                      <span className="text-sm sm:text-base">Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-lock text-sm sm:text-base"></i>
                      <span className="text-sm sm:text-base">Pay {formatCurrency(totalWithFees)}</span>
                    </>
                  )}
                </button>

                {error && (
                  <div className="mt-3 sm:mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <i className="fas fa-exclamation-circle text-red-500 text-sm"></i>
                      <span className="text-red-700 text-xs sm:text-sm">{error}</span>
                    </div>
                  </div>
                )}

                {/* Security Notice */}
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <i className="fas fa-shield-alt text-green-500 mt-0.5 sm:mt-1 text-sm"></i>
                    <div>
                      <h4 className="font-medium text-gray-900 text-xs sm:text-sm">Secure Payment</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        Your payment information is encrypted and secure. We use industry-standard SSL encryption to protect your data.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 sm:mt-8 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Payment Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Payment Processing</h4>
              <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                <li>• Payments are processed immediately</li>
                <li>• Receipt will be sent to your email</li>
                <li>• Payment confirmation within 24 hours</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Need Help?</h4>
              <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                <li>• Contact: +260 955 123 456</li>
                <li>• Email: payments@school.com</li>
                <li>• Office Hours: 8AM - 5PM</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentPaymentPage; 