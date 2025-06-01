import React, { useState, useEffect } from 'react';

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
      const paymentData = {
        student_id: paymentForm.student_id,
        amount: parseFloat(paymentForm.amount),
        payment_method: paymentForm.payment_method,
        payment_date: new Date(paymentForm.payment_date).toISOString(),
        notes: paymentForm.notes,
        payment_type: paymentForm.payment_type
      };

      const response = await fetch(`${API_BASE_URL}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const newPayment = result.data;
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
        }
      }
    } catch (err) {
      console.error('Error creating payment:', err);
      setError('Failed to create payment.');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZM', {
      style: 'currency',
      currency: 'ZMW',
      minimumFractionDigits: 2
    }).format(amount);
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Process New Payment</h2>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>
            <div className="p-6">
              {/* Student Search */}
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Find Student</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Search by name or ID..."
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onChange={(e) => handleStudentSearch(e.target.value)}
                      />
                      <button
                        type="button"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        <i className="fas fa-search"></i>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quick Filters</label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
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
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Student Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="mb-2"><span className="font-medium">Name:</span> {selectedStudent.first_name} {selectedStudent.last_name}</div>
                      <div className="mb-2"><span className="font-medium">Student ID:</span> {selectedStudent.student_id}</div>
                      <div className="mb-2"><span className="font-medium">Class:</span> {selectedStudent.grade}</div>
                    </div>
                    <div>
                      <div className="mb-2"><span className="font-medium">Guardian:</span> {selectedStudent.parent_student_links?.map(p => `${p.parents.first_name} ${p.parents.last_name}`).join(', ') || 'N/A'}</div>
                      <div className="mb-2"><span className="font-medium">Contact:</span> {selectedStudent.parent_student_links?.map(p => p.parents.phone).join(', ') || 'N/A'}</div>
                      <div className="mb-2"><span className="font-medium">Balance Due:</span> <span className="font-bold text-red-600">N/A</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Form */}
              <form onSubmit={handlePaymentSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Type *</label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={paymentForm.amount}
                        onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method *</label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={paymentForm.payment_method}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, payment_method: e.target.value }))}
                      required
                    >
                      <option value="">Select payment method</option>
                      <option value="Cash">Cash</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Mobile Money">Mobile Money</option>
                      <option value="Check">Check</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Date *</label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={paymentForm.payment_date}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, payment_date: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Add any additional information about this payment"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={paymentForm.notes}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                    disabled={!selectedStudent}
                  >
                    <i className="fas fa-save"></i>
                    Save Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceiptModal && receiptData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Payment Receipt</h2>
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Fee Master School</h3>
                <p className="text-gray-600">123 Education St, City, Country</p>
                <p className="text-gray-600">Tel: +1-234-567-8900</p>
              </div>

              <div className="flex justify-between mb-6">
                <div>
                  <span className="font-medium">Receipt #:</span>
                  <span className="ml-2">{receiptData.id}</span>
                </div>
                <div>
                  <span className="font-medium">Date:</span>
                  <span className="ml-2">{formatDate(receiptData.payment_date)}</span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Student Information</h4>
                <div className="space-y-2">
                  <div><span className="font-medium">Name:</span> {receiptData.student_name}</div>
                  <div><span className="font-medium">Student ID:</span> {receiptData.student_id}</div>
                  <div><span className="font-medium">Class:</span> {selectedStudent?.grade || 'N/A'}</div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Payment Details</h4>
                <table className="w-full border border-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left border border-gray-300">Description</th>
                      <th className="px-4 py-2 text-right border border-gray-300">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 border border-gray-300">{receiptData.payment_type}</td>
                      <td className="px-4 py-2 text-right border border-gray-300">${receiptData.amount.toFixed(2)}</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left border border-gray-300">Total</th>
                      <th className="px-4 py-2 text-right border border-gray-300">${receiptData.amount.toFixed(2)}</th>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="font-medium">Payment Method:</span>
                  <span className="ml-2">{receiptData.payment_method}</span>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <span className="ml-2">{getStatusBadge(receiptData.payment_status)}</span>
                </div>
              </div>

              <div className="text-center border-t border-gray-200 pt-4">
                <p className="font-medium">Thank you for your payment!</p>
                <p className="text-sm text-gray-500">This is an electronically generated receipt.</p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <i className="fas fa-download"></i>
                  Download Receipt
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