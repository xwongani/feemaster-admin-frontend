import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

interface FinancialOverview {
  total_revenue: number;
  collected: number;
  outstanding: number;
  collection_rate: number;
  comparisons: {
    total_revenue: number;
    collected: number;
    outstanding: number;
    collection_rate: number;
  };
}

interface OutstandingByGrade {
  grade: string;
  total_students: number;
  outstanding_amount: number;
}

interface RecentTransaction {
  id: string;
  receipt_number?: string;
  payment_date: string;
  student_name: string;
  amount: number;
  payment_method: string;
  payment_status: string;
  student_id?: string;
  grade?: string;
}

const FinancialDashboard: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState('current-term');
  const [showDateRange, setShowDateRange] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  // Financial data state
  const [summaryData, setSummaryData] = useState<FinancialOverview>({
    total_revenue: 0,
    collected: 0,
    outstanding: 0,
    collection_rate: 0,
    comparisons: {
      total_revenue: 0,
      collected: 0,
      outstanding: 0,
      collection_rate: 0
    }
  });

  const [revenueCollectionData, setRevenueCollectionData] = useState<any>({
    labels: [],
    datasets: []
  });

  const [paymentMethodsData, setPaymentMethodsData] = useState<any>({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
      borderWidth: 0,
    }]
  });

  const [monthlyCollectionsData, setMonthlyCollectionsData] = useState<any>({
    labels: [],
    datasets: []
  });

  const [outstandingByGrade, setOutstandingByGrade] = useState<OutstandingByGrade[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([]);

  const API_BASE_URL = (window as any).REACT_APP_API_BASE_URL || 'http://localhost:8000/api/v1';

  useEffect(() => {
    fetchAllData();
  }, [timePeriod, dateRange]);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([
        fetchFinancialOverview(),
        fetchRevenueCollections(),
        fetchPaymentMethods(),
        fetchMonthlyCollections(),
        fetchOutstandingByGrade(),
        fetchRecentTransactions()
      ]);
    } catch (err) {
      console.error('Error fetching financial dashboard data:', err);
      setError('Failed to load financial dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchFinancialOverview = async () => {
    try {
      const params = new URLSearchParams({
        period: timePeriod
      });

      if (timePeriod === 'custom' && dateRange.startDate && dateRange.endDate) {
        params.append('start_date', dateRange.startDate);
        params.append('end_date', dateRange.endDate);
      }

      const response = await fetch(`${API_BASE_URL}/financial/dashboard/overview?${params}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSummaryData(result.data);
        }
      }
    } catch (err) {
      console.error('Error fetching financial overview:', err);
    }
  };

  const fetchRevenueCollections = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/financial/dashboard/revenue-collections?period=${timePeriod}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data.length > 0) {
          const labels = result.data.map((item: any) => item.month);
          const expectedRevenue = result.data.map((item: any) => item.expected_revenue);
          const collected = result.data.map((item: any) => item.collected);

          setRevenueCollectionData({
            labels,
            datasets: [
              {
                label: 'Expected Revenue',
                data: expectedRevenue,
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
              },
              {
                label: 'Collected',
                data: collected,
                borderColor: 'rgb(16, 185, 129)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
              }
            ]
          });
        }
      }
    } catch (err) {
      console.error('Error fetching revenue collections:', err);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/financial/dashboard/payment-methods?period=${timePeriod}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data.length > 0) {
          const labels = result.data.map((item: any) => item.payment_method);
          const percentages = result.data.map((item: any) => item.percentage);

          setPaymentMethodsData({
            labels,
            datasets: [{
              data: percentages,
              backgroundColor: [
                '#3B82F6',
                '#10B981',
                '#F59E0B',
                '#EF4444',
                '#8B5CF6'
              ],
              borderWidth: 0,
            }]
          });
        }
      }
    } catch (err) {
      console.error('Error fetching payment methods:', err);
    }
  };

  const fetchMonthlyCollections = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/financial/dashboard/monthly-collections?period=${timePeriod}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data.length > 0) {
          const labels = result.data.map((item: any) => item.month);
          const tuitionFees = result.data.map((item: any) => item.tuition_fees || 0);
          const otherFees = result.data.map((item: any) => item.other_fees || 0);

          setMonthlyCollectionsData({
            labels,
            datasets: [
              {
                label: 'Tuition Fees',
                data: tuitionFees,
                backgroundColor: '#3B82F6',
              },
              {
                label: 'Other Fees',
                data: otherFees,
                backgroundColor: '#10B981',
              },
            ]
          });
        }
      }
    } catch (err) {
      console.error('Error fetching monthly collections:', err);
    }
  };

  const fetchOutstandingByGrade = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/financial/dashboard/outstanding-by-grade`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setOutstandingByGrade(result.data || []);
        }
      }
    } catch (err) {
      console.error('Error fetching outstanding by grade:', err);
    }
  };

  const fetchRecentTransactions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/financial/dashboard/recent-transactions?limit=10`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setRecentTransactions(result.data || []);
        }
      }
    } catch (err) {
      console.error('Error fetching recent transactions:', err);
    }
  };

  const handleExportData = async () => {
    try {
      const params = new URLSearchParams({
        format: 'csv',
        period: timePeriod
      });

      if (timePeriod === 'custom' && dateRange.startDate && dateRange.endDate) {
        params.append('start_date', dateRange.startDate);
        params.append('end_date', dateRange.endDate);
      }

      const response = await fetch(`${API_BASE_URL}/financial/export/financial-data?${params}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // In a real implementation, you would create and download a CSV file
          console.log('Export data:', result.data);
          alert(`Financial data exported successfully! ${result.data.total_records} records processed.`);
        }
      }
    } catch (err) {
      console.error('Error exporting financial data:', err);
      setError('Failed to export financial data. Please try again.');
    }
  };

  // Financial summary data - now populated from backend
  const financialSummary = {
    totalRevenue: summaryData.total_revenue,
    collected: summaryData.collected,
    outstanding: summaryData.outstanding,
    collectionRate: summaryData.collection_rate,
    comparisons: summaryData.comparisons
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return 'K ' + (value / 1000);
          }
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  const handleTimePeriodChange = (period: string) => {
    setTimePeriod(period);
    if (period === 'custom') {
      setShowDateRange(true);
    } else {
      setShowDateRange(false);
    }
  };

  const getComparisonBadge = (value: number) => {
    const isPositive = value > 0;
    return (
      <span className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? '+' : ''}{value}% vs last period
      </span>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <i className="fas fa-chart-line"></i>
              Financial Dashboard
            </h1>
            <p className="text-gray-600">Monitor revenue, collections, and financial performance.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="timePeriod" className="text-sm font-medium text-gray-700">Time Period:</label>
              <select
                id="timePeriod"
                value={timePeriod}
                onChange={(e) => handleTimePeriodChange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="current-term">Current Term</option>
                <option value="previous-term">Previous Term</option>
                <option value="current-year">Current Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              <i className="fas fa-sync"></i>
              Sync with QuickBooks
            </button>
            <button 
              onClick={handleExportData}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              <i className="fas fa-file-export"></i>
              Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <i className="fas fa-exclamation-circle text-red-400"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <div className="ml-auto">
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading financial dashboard...</span>
          </div>
        </div>
      )}

      {/* Content when not loading */}
      {!loading && (
        <>
          {/* Custom Date Range */}
          {showDateRange && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date:</label>
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date:</label>
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-end">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <i className="fas fa-check"></i>
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Financial Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <i className="fas fa-hand-holding-usd text-white text-xl"></i>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
                  <p className="text-2xl font-bold text-gray-900">K {financialSummary.totalRevenue.toLocaleString()}</p>
                  {getComparisonBadge(financialSummary.comparisons.total_revenue)}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <i className="fas fa-money-bill-wave text-white text-xl"></i>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Collected</h3>
                  <p className="text-2xl font-bold text-gray-900">K {financialSummary.collected.toLocaleString()}</p>
                  {getComparisonBadge(financialSummary.comparisons.collected)}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                    <i className="fas fa-hourglass-half text-white text-xl"></i>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Outstanding</h3>
                  <p className="text-2xl font-bold text-gray-900">K {financialSummary.outstanding.toLocaleString()}</p>
                  {getComparisonBadge(financialSummary.comparisons.outstanding)}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <i className="fas fa-percentage text-white text-xl"></i>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Collection Rate</h3>
                  <p className="text-2xl font-bold text-gray-900">{financialSummary.collectionRate}%</p>
                  {getComparisonBadge(financialSummary.comparisons.collection_rate)}
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Revenue & Collections Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <i className="fas fa-chart-bar"></i>
                    Revenue & Collections
                  </h2>
                  <div className="flex items-center gap-2">
                    <button className="text-gray-400 hover:text-gray-600" title="Download">
                      <i className="fas fa-download"></i>
                    </button>
                    <button className="text-gray-400 hover:text-gray-600" title="Print">
                      <i className="fas fa-print"></i>
                    </button>
                    <button className="text-gray-400 hover:text-gray-600" title="Expand">
                      <i className="fas fa-expand"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div style={{ height: '300px' }}>
                  <Line data={revenueCollectionData} options={chartOptions} />
                </div>
              </div>
            </div>

            {/* Payment Methods Distribution */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <i className="fas fa-chart-pie"></i>
                  Payment Methods
                </h2>
              </div>
              <div className="p-6">
                <div style={{ height: '300px' }}>
                  <Doughnut data={paymentMethodsData} options={doughnutOptions} />
                </div>
              </div>
            </div>

            {/* Monthly Collections by Type */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <i className="fas fa-chart-column"></i>
                  Monthly Collections by Type
                </h2>
              </div>
              <div className="p-6">
                <div style={{ height: '300px' }}>
                  <Bar data={monthlyCollectionsData} options={chartOptions} />
                </div>
              </div>
            </div>

            {/* Outstanding Payments by Grade */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <i className="fas fa-exclamation-triangle"></i>
                  Outstanding by Grade
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {outstandingByGrade.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{item.grade}</div>
                        <div className="text-sm text-gray-500">{item.total_students} students</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-red-600">K {item.outstanding_amount.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">outstanding</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Financial Insights & Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Key Insights */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <i className="fas fa-lightbulb"></i>
                    Key Financial Insights
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-gray-900">Collection rate improved</p>
                        <p className="text-sm text-gray-600">Your collection rate increased by {financialSummary.comparisons.collection_rate}% compared to last period, indicating better payment follow-up processes.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-gray-900">Grade 4 needs attention</p>
                        <p className="text-sm text-gray-600">Grade 4 has the highest outstanding amount (K {financialSummary.comparisons.outstanding.toLocaleString()}) and may require targeted collection efforts.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-gray-900">Bank transfers preferred</p>
                        <p className="text-sm text-gray-600">45% of payments are made via bank transfer, indicating parents prefer electronic payments.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-gray-900">Outstanding amount increased</p>
                        <p className="text-sm text-gray-600">Outstanding payments increased by {financialSummary.comparisons.outstanding}%.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <i className="fas fa-bolt"></i>
                    Quick Actions
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                      <i className="fas fa-envelope"></i>
                      Send Payment Reminders
                    </button>
                    <button className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2">
                      <i className="fas fa-file-invoice"></i>
                      Generate Invoices
                    </button>
                    <button className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 flex items-center gap-2">
                      <i className="fas fa-chart-line"></i>
                      View Detailed Reports
                    </button>
                    <button className="w-full bg-yellow-600 text-white px-4 py-3 rounded-lg hover:bg-yellow-700 flex items-center gap-2">
                      <i className="fas fa-calendar-alt"></i>
                      Schedule Reminders
                    </button>
                    <button className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 flex items-center gap-2">
                      <i className="fas fa-download"></i>
                      Export Financial Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FinancialDashboard;