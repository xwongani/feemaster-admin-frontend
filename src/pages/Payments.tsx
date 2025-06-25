import React, { useState, useEffect } from 'react';
import { paymentGateway } from '../services/paymentGatewayService';

interface Payment {
  id: string;
  student_id: string;
  student_name?: string;
  student_number?: string;
  grade?: string;
  amount: number;
  payment_date: string;
  payment_status: 'completed' | 'pending' | 'failed';
  payment_method: string;
  receipt_number?: string;
  notes?: string;
  payment_type?: string;
}

interface Student {
  id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  grade: string;
  class_name?: string;
  parent_student_links?: Array<{
    relationship: string;
    is_primary_contact: boolean;
    parents: {
      first_name: string;
      last_name: string;
      phone: string;
      email: string;
    };
  }>;
}

interface PaymentStats {
  total_amount: number;
  completed_amount: number;
  pending_amount: number;
  failed_amount: number;
  total_count: number;
  completed_count: number;
  pending_count: number;
  failed_count: number;
}

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [receiptData, setReceiptData] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<PaymentStats>({
    total_amount: 0,
    completed_amount: 0,
    pending_amount: 0,
    failed_amount: 0,
    total_count: 0,
    completed_count: 0,
    pending_count: 0,
    failed_count: 0
  });
  const [filters, setFilters] = useState({
    dateRange: 'this_month',
    status: 'all',
    method: 'all'
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(10);

  // Sample students data for payment modal
  const [students, setStudents] = useState<Student[]>([]);

  // Payment form state
  const [paymentForm, setPaymentForm] = useState({
    student_id: '',
    amount: '',
    payment_method: '',
    payment_date: new Date().toISOString().split('T')[0],
    notes: '',
    payment_type: 'tuition'
  });

  // Get available payment methods
  const availablePaymentMethods = paymentGateway.getPaymentMethods();
  
  // Calculate fees for selected method
  const fees = paymentGateway.calculateFees(parseFloat(paymentForm.amount) || 0, paymentForm.payment_method);
  const totalWithFees = (parseFloat(paymentForm.amount) || 0) + fees;

  const API_BASE_URL = (window as any).REACT_APP_API_BASE_URL || 'http://localhost:8000/api/v1';

  useEffect(() => {
    fetchPayments();
    fetchPaymentStats();
    fetchStudents();
  }, [currentPage, filters]);

  useEffect(() => {
    filterPayments();
  }, [payments, searchTerm]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        per_page: perPage.toString(),
      });

      if (filters.status !== 'all') params.append('payment_status', filters.status);
      if (filters.method !== 'all') params.append('payment_method', filters.method);

      const response = await fetch(`${API_BASE_URL}/payments?${params}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setPayments(result.data || []);
        setTotalPages(result.total_pages || 1);
      } else {
        throw new Error(result.message || 'Failed to fetch payments');
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('Failed to load payments. Using fallback data.');
      
      // Fallback data
      setPayments([
        {
          id: '1',
          student_id: 'STU-001423',
          student_name: 'John Mwanza',
          amount: 1500.00,
          payment_date: '2024-01-15',
          payment_status: 'completed',
          payment_method: 'Bank Transfer',
          notes: 'Monthly tuition payment'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/summary/financial`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setStats(result.data);
        }
      }
    } catch (err) {
      console.error('Error fetching payment stats:', err);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/students?per_page=100`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setStudents(result.data || []);
        }
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const filterPayments = () => {
    let filtered = payments;

    if (searchTerm) {
      filtered = filtered.filter(payment =>
        (payment.student_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (payment.payment_method || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPayments(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    };
    const statusText = {
      completed: 'Completed',
      pending: 'Pending',
      failed: 'Failed'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status as keyof typeof statusClasses]}`}>
        {statusText[status as keyof typeof statusText]}
      </span>
    );
  };

  const handleStudentSearch = (searchValue: string) => {
    const student = students.find(s => 
      `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchValue.toLowerCase()) ||
      s.student_id.toLowerCase().includes(searchValue.toLowerCase())
    );
    setSelectedStudent(student || null);
    if (student) {
      setPaymentForm(prev => ({ ...prev, student_id: student.id }));
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    try {
      // Use payment gateway service
      const paymentRequest = {
        amount: parseFloat(paymentForm.amount),
        currency: 'ZMW',
        studentId: paymentForm.student_id,
        studentName: `${selectedStudent.first_name} ${selectedStudent.last_name}`,
        paymentMethod: paymentForm.payment_method,
        paymentType: paymentForm.payment_type,
        description: paymentForm.notes,
        metadata: {
          payment_date: new Date(paymentForm.payment_date).toISOString()
        }
      };

      const result = await paymentGateway.processPayment(paymentRequest);
      
      if (result.success) {
        const newPayment = {
          id: result.transactionId || `PAY-${Date.now()}`,
          student_id: selectedStudent.student_id,
          student_name: `${selectedStudent.first_name} ${selectedStudent.last_name}`,
          amount: parseFloat(paymentForm.amount),
          payment_date: paymentForm.payment_date,
          payment_status: 'completed' as const,
          payment_method: paymentForm.payment_method,
          payment_type: paymentForm.payment_type,
          notes: paymentForm.notes
        };
        
        setPayments(prev => [newPayment, ...prev]);
        setReceiptData(newPayment);
        setShowPaymentModal(false);
        setShowReceiptModal(true);
        
        // Reset form
        setPaymentForm({
          student_id: '',
          amount: '',
          payment_method: '',
          payment_date: new Date().toISOString().split('T')[0],
          notes: '',
          payment_type: 'tuition'
        });
        setSelectedStudent(null);
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error('Error creating payment:', err);
      setError('Failed to create payment.');
    }
  };

  const formatCurrency = (amount: number) => {
    return paymentGateway.formatCurrency(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZM', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
        <p className="text-gray-600">Track and manage student payments and fee collections.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <i className="fas fa-money-bill-wave text-white text-xl"></i>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Payments</h3>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.total_amount)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <i className="fas fa-check-circle text-white text-xl"></i>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Completed</h3>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.completed_amount)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                <i className="fas fa-clock text-white text-xl"></i>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Pending</h3>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.pending_amount)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                <i className="fas fa-times-circle text-white text-xl"></i>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Failed</h3>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.failed_amount)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payments Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <h2 className="text-lg font-medium text-gray-900">Payment Transactions</h2>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="text"
                      placeholder="Search payments..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <i className="fas fa-plus"></i>
                    New Payment
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">{payment.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{payment.student_name}</div>
                        <div className="text-sm text-gray-500">{payment.student_id}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{payment.payment_type}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(payment.amount)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatDate(payment.payment_date)}
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(payment.payment_status)}</td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => {
                              setReceiptData(payment);
                              setShowReceiptModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900" 
                            title="View Receipt"
                          >
                            <i className="fas fa-receipt"></i>
                          </button>
                          <button className="text-green-600 hover:text-green-900" title="Edit Payment">
                            <i className="fas fa-edit"></i>
                          </button>
                          <button className="text-red-600 hover:text-red-900" title="Delete Payment">
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
        </div>

        {/* Recent Activity Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {/* Recent activity content */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl w-full max-w-4xl sm:max-w-5xl mx-auto max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 py-3 sm:py-4 rounded-t-xl sm:rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold text-white">Process New Payment</h2>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-white hover:text-gray-200"
                >
                  <i className="fas fa-times text-lg sm:text-xl"></i>
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              {/* Student Search */}
              <div className="mb-4 sm:mb-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Find Student</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Search by name or ID..."
                        className="flex-1 border border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onChange={(e) => handleStudentSearch(e.target.value)}
                      />
                      <button
                        type="button"
                        className="bg-blue-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:bg-blue-700 transition-colors"
                      >
                        <i className="fas fa-search"></i>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quick Filters</label>
                    <select className="w-full border border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Filter by class</option>
                      <option value="grade1">Grade 1</option>
                      <option value="grade2">Grade 2</option>
                      <option value="grade3">Grade 3</option>
                      <option value="grade4">Grade 4</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Student Info Card */}
              {selectedStudent && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 border border-blue-200">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                    <i className="fas fa-user-graduate text-blue-600"></i>
                    Student Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-user text-blue-600 text-sm sm:text-base"></i>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm text-gray-600">Student Name</p>
                          <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{selectedStudent.first_name} {selectedStudent.last_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-id-card text-green-600 text-sm sm:text-base"></i>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm text-gray-600">Student ID</p>
                          <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{selectedStudent.student_id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-graduation-cap text-purple-600 text-sm sm:text-base"></i>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm text-gray-600">Class</p>
                          <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{selectedStudent.grade}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-users text-orange-600 text-sm sm:text-base"></i>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm text-gray-600">Guardian</p>
                          <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{selectedStudent.parent_student_links?.map(p => `${p.parents.first_name} ${p.parents.last_name}`).join(', ') || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-phone text-red-600 text-sm sm:text-base"></i>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm text-gray-600">Contact</p>
                          <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{selectedStudent.parent_student_links?.map(p => p.parents.phone).join(', ') || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-exclamation-triangle text-yellow-600 text-sm sm:text-base"></i>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm text-gray-600">Balance Due</p>
                          <p className="font-bold text-red-600 text-sm sm:text-base">N/A</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Form */}
              <form onSubmit={handlePaymentSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                  {/* Payment Details */}
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                      <i className="fas fa-credit-card text-blue-600"></i>
                      Payment Details
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Type *</label>
                        <select
                          className="w-full border border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={paymentForm.payment_type}
                          onChange={(e) => setPaymentForm(prev => ({ ...prev, payment_type: e.target.value }))}
                          required
                        >
                          <option value="">Select payment type</option>
                          <option value="Tuition Fee">Tuition Fee</option>
                          <option value="Uniform Fee">Uniform Fee</option>
                          <option value="Books & Supplies">Books & Supplies</option>
                          <option value="Transportation">Transportation</option>
                          <option value="Other Fees">Other Fees</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
                        <div className="relative">
                          <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold text-sm sm:text-base">ZMW</span>
                          <input
                            type="number"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={paymentForm.amount}
                            onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Date *</label>
                        <input
                          type="date"
                          className="w-full border border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={paymentForm.payment_date}
                          onChange={(e) => setPaymentForm(prev => ({ ...prev, payment_date: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Selection */}
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                      <i className="fas fa-wallet text-green-600"></i>
                      Payment Method
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      {availablePaymentMethods.map((method) => (
                        <div
                          key={method.id}
                          className={`relative cursor-pointer rounded-lg sm:rounded-xl border-2 p-3 sm:p-4 transition-all duration-200 ${
                            paymentForm.payment_method === method.name
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setPaymentForm(prev => ({ ...prev, payment_method: method.name }))}
                        >
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
                              paymentForm.payment_method === method.name
                                ? 'border-blue-500 bg-blue-500'
                                : 'border-gray-300'
                            }`}>
                              {paymentForm.payment_method === method.name && (
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="mt-4 sm:mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Add any additional information about this payment..."
                    className="w-full border border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={paymentForm.notes}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>

                {/* Fee Breakdown */}
                {paymentForm.amount && paymentForm.payment_method && (
                  <div className="mt-4 sm:mt-6 bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
                      <i className="fas fa-calculator text-blue-600"></i>
                      Payment Breakdown
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm sm:text-base">Subtotal:</span>
                        <span className="font-semibold text-gray-900 text-sm sm:text-base">{formatCurrency(parseFloat(paymentForm.amount))}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm sm:text-base">Processing Fee:</span>
                        <span className="font-semibold text-gray-900 text-sm sm:text-base">{formatCurrency(fees)}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-900 text-sm sm:text-base">Total Amount:</span>
                          <span className="text-lg font-bold text-blue-600">{formatCurrency(totalWithFees)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200 mt-4 sm:mt-6">
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2 text-sm sm:text-base"
                    disabled={!selectedStudent}
                  >
                    <i className="fas fa-save"></i>
                    Process Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceiptModal && receiptData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl w-full max-w-2xl sm:max-w-3xl mx-auto max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 sm:px-6 py-3 sm:py-4 rounded-t-xl sm:rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <i className="fas fa-receipt text-sm sm:text-base"></i>
                  Payment Receipt
                </h2>
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="text-white hover:text-gray-200"
                >
                  <i className="fas fa-times text-lg sm:text-xl"></i>
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              {/* School Header */}
              <div className="text-center mb-6 sm:mb-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <i className="fas fa-graduation-cap text-blue-600 text-lg sm:text-2xl"></i>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Fee Master School</h3>
                <p className="text-gray-600 text-sm sm:text-base">123 Education Street, Lusaka, Zambia</p>
                <p className="text-gray-600 text-sm sm:text-base">Tel: +260 955 123 456 | Email: info@feemaster.edu.zm</p>
              </div>

              {/* Receipt Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
                    <i className="fas fa-file-invoice text-blue-600"></i>
                    Receipt Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm sm:text-base">Receipt #:</span>
                      <span className="font-mono font-semibold text-gray-900 text-sm sm:text-base">{receiptData.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm sm:text-base">Date:</span>
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">{formatDate(receiptData.payment_date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm sm:text-base">Time:</span>
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">{new Date(receiptData.payment_date).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
                    <i className="fas fa-user-graduate text-green-600"></i>
                    Student Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm sm:text-base">Name:</span>
                      <span className="font-semibold text-gray-900 text-sm sm:text-base truncate">{receiptData.student_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm sm:text-base">Student ID:</span>
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">{receiptData.student_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm sm:text-base">Class:</span>
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">{selectedStudent?.grade || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden mb-4 sm:mb-6">
                <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <i className="fas fa-credit-card text-purple-600"></i>
                    Payment Details
                  </h4>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-100">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{receiptData.payment_type}</p>
                        <p className="text-xs sm:text-sm text-gray-600">Fee payment</p>
                      </div>
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">{formatCurrency(receiptData.amount)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-100">
                      <span className="text-gray-600 text-sm sm:text-base">Subtotal</span>
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">{formatCurrency(receiptData.amount)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-100">
                      <span className="text-gray-600 text-sm sm:text-base">Processing Fee</span>
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">{formatCurrency(fees)}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 sm:py-4 bg-green-50 rounded-lg px-3 sm:px-4">
                      <span className="text-base sm:text-lg font-semibold text-gray-900">Total Amount</span>
                      <span className="text-xl sm:text-2xl font-bold text-green-600">{formatCurrency(totalWithFees)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
                    <i className="fas fa-wallet text-orange-600"></i>
                    Payment Method
                  </h4>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-credit-card text-white text-sm sm:text-base"></i>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{receiptData.payment_method}</p>
                      <p className="text-xs sm:text-sm text-gray-600">Secure payment processed</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
                    <i className="fas fa-check-circle text-green-600"></i>
                    Payment Status
                  </h4>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-check text-white text-sm sm:text-base"></i>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">Completed</p>
                      <p className="text-xs sm:text-sm text-gray-600">Payment successful</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {receiptData.notes && (
                <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <i className="fas fa-sticky-note text-blue-600"></i>
                    Additional Notes
                  </h4>
                  <p className="text-gray-700 text-sm sm:text-base">{receiptData.notes}</p>
                </div>
              )}

              {/* Footer */}
              <div className="text-center border-t border-gray-200 pt-4 sm:pt-6">
                <p className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Thank you for your payment!</p>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">This is an electronically generated receipt.</p>
                <div className="flex items-center justify-center gap-3 sm:gap-4 text-xs text-gray-500">
                  <span>Generated on {new Date().toLocaleDateString()}</span>
                  <span>•</span>
                  <span>Receipt #{receiptData.id}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl sm:rounded-b-2xl">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  Close
                </button>
                <button 
                  onClick={() => window.print()}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-blue-600 text-white rounded-lg sm:rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <i className="fas fa-print"></i>
                  Print Receipt
                </button>
                <button className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-green-600 text-white rounded-lg sm:rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base">
                  <i className="fas fa-download"></i>
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;