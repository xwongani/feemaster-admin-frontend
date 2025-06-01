import React, { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState('financial');
  const [timePeriod, setTimePeriod] = useState('this-month');
  const [showDateRange, setShowDateRange] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  // Quick metrics data
  const metrics = {
    total_collections: 125750.00,
    outstanding_balance: 67420.00,
    collection_rate: 65.1,
    total_transactions: 342,
    trends: {
      collections: 12.5,
      outstanding: 5.3,
      collection_rate: 3.2,
      transactions: 8.9
    }
  };

  // Monthly Collections Chart Data
  const monthlyCollectionsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'School Fees',
        data: [45000, 48000, 52000, 49000, 51000, 55000],
        backgroundColor: '#3B82F6',
      },
      {
        label: 'Transport',
        data: [8000, 8500, 9000, 8200, 8800, 9200],
        backgroundColor: '#10B981',
      },
      {
        label: 'Other Fees',
        data: [3000, 3200, 3500, 3100, 3400, 3600],
        backgroundColor: '#F59E0B',
      }
    ],
  };

  // Payment Distribution Chart Data
  const paymentDistributionData = {
    labels: ['School Fees', 'Transport', 'School Supplies', 'Activities', 'Other'],
    datasets: [
      {
        data: [66.8, 83.2, 40.8, 44.1, 55.5],
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6'
        ],
        borderWidth: 0,
      },
    ],
  };

  // Financial Summary Table Data
  const financialSummary = [
    {
      category: 'School Fees',
      expected: 157500.00,
      collected: 105250.00,
      outstanding: 52250.00,
      collectionRate: 66.8
    },
    {
      category: 'Transport',
      expected: 18400.00,
      collected: 15300.00,
      outstanding: 3100.00,
      collectionRate: 83.2
    },
    {
      category: 'School Supplies',
      expected: 12750.00,
      collected: 5200.00,
      outstanding: 7550.00,
      collectionRate: 40.8
    },
    {
      category: 'Activities',
      expected: 8500.00,
      collected: 3750.00,
      outstanding: 4750.00,
      collectionRate: 44.1
    }
  ];

  // Student Reports Data
  const studentReports = [
    { grade: 'Grade 1', totalStudents: 45, paidStudents: 32, unpaidStudents: 13, collectionRate: 71.1 },
    { grade: 'Grade 2', totalStudents: 52, paidStudents: 38, unpaidStudents: 14, collectionRate: 73.1 },
    { grade: 'Grade 3', totalStudents: 48, paidStudents: 31, unpaidStudents: 17, collectionRate: 64.6 },
    { grade: 'Grade 4', totalStudents: 55, paidStudents: 34, unpaidStudents: 21, collectionRate: 61.8 }
  ];

  // Class Reports Data
  const classReports = [
    { className: '1A', students: 23, totalFees: 34500, collected: 28750, outstanding: 5750, collectionRate: 83.3 },
    { className: '1B', students: 22, totalFees: 33000, collected: 26400, outstanding: 6600, collectionRate: 80.0 },
    { className: '2A', students: 26, totalFees: 39000, collected: 31200, outstanding: 7800, collectionRate: 80.0 },
    { className: '2B', students: 26, totalFees: 39000, collected: 29250, outstanding: 9750, collectionRate: 75.0 }
  ];

  // Payment Reports Data
  const paymentReports = [
    { method: 'Bank Transfer', count: 156, amount: 78000, percentage: 45.2 },
    { method: 'Cash', count: 89, amount: 32500, percentage: 25.8 },
    { method: 'Mobile Money', count: 67, amount: 18200, percentage: 19.5 },
    { method: 'Credit Card', count: 23, amount: 12400, percentage: 6.7 },
    { method: 'Check', count: 7, amount: 4650, percentage: 2.8 }
  ];

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

  const getTrendBadge = (value: number) => {
    const isPositive = value > 0;
    return (
      <span className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? '+' : ''}{value}% vs last period
      </span>
    );
  };

  const exportReport = (reportType: string) => {
    // This would trigger the actual export functionality
    console.log(`Exporting ${reportType} report...`);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Financial Reports</h1>
            <p className="text-gray-600">Analyze your school's financial performance with detailed reports and visualizations.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search reports..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="reportPeriod" className="text-sm font-medium text-gray-700">Time Period:</label>
              <select
                id="reportPeriod"
                value={timePeriod}
                onChange={(e) => handleTimePeriodChange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
                <option value="this-term">This Term</option>
                <option value="last-term">Last Term</option>
                <option value="this-year">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <i className="fas fa-print"></i>
              Print Reports
            </button>
          </div>
        </div>
      </div>

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

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <i className="fas fa-money-bill-alt text-white text-xl"></i>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Collections</h3>
              <p className="text-2xl font-bold text-gray-900">K {metrics.total_collections.toLocaleString()}</p>
              {getTrendBadge(metrics.trends.collections)}
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
              <h3 className="text-sm font-medium text-gray-500">Outstanding Balance</h3>
              <p className="text-2xl font-bold text-gray-900">K {metrics.outstanding_balance.toLocaleString()}</p>
              {getTrendBadge(metrics.trends.outstanding)}
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
              <p className="text-2xl font-bold text-gray-900">{metrics.collection_rate}%</p>
              {getTrendBadge(metrics.trends.collection_rate)}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <i className="fas fa-exchange-alt text-white text-xl"></i>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Transactions</h3>
              <p className="text-2xl font-bold text-gray-900">{metrics.total_transactions}</p>
              {getTrendBadge(metrics.trends.transactions)}
            </div>
          </div>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <div className="flex">
            {[
              { id: 'financial', label: 'Financial Reports', icon: 'fas fa-chart-line' },
              { id: 'student', label: 'Student Reports', icon: 'fas fa-user-graduate' },
              { id: 'class', label: 'Class Reports', icon: 'fas fa-chalkboard-teacher' },
              { id: 'payment', label: 'Payment Reports', icon: 'fas fa-credit-card' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium border-b-2 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <i className={tab.icon}></i>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Financial Reports Tab */}
        {activeTab === 'financial' && (
          <div className="p-6">
            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Monthly Collections Chart */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Monthly Collections</h3>
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
                <div style={{ height: '300px' }}>
                  <Bar data={monthlyCollectionsData} options={chartOptions} />
                </div>
              </div>

              {/* Payment Distribution Chart */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Payment Distribution</h3>
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
                <div style={{ height: '300px' }}>
                  <Doughnut data={paymentDistributionData} options={doughnutOptions} />
                </div>
              </div>
            </div>

            {/* Financial Summary Table */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Financial Summary</h3>
                <button 
                  onClick={() => exportReport('financial')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <i className="fas fa-file-export"></i>
                  Export
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collected Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outstanding</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collection Rate</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {financialSummary.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.category}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">K {item.expected.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">K {item.collected.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-red-600">K {item.outstanding.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{item.collectionRate}%</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-bold">
                      <td className="px-6 py-4 text-sm text-gray-900">Total</td>
                      <td className="px-6 py-4 text-sm text-gray-900">K {financialSummary.reduce((sum, item) => sum + item.expected, 0).toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">K {financialSummary.reduce((sum, item) => sum + item.collected, 0).toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-red-600">K {financialSummary.reduce((sum, item) => sum + item.outstanding, 0).toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{((financialSummary.reduce((sum, item) => sum + item.collected, 0) / financialSummary.reduce((sum, item) => sum + item.expected, 0)) * 100).toFixed(1)}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Student Reports Tab */}
        {activeTab === 'student' && (
          <div className="p-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Student Payment Status by Grade</h3>
                <button 
                  onClick={() => exportReport('student')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <i className="fas fa-file-export"></i>
                  Export
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Students</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid Students</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unpaid Students</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collection Rate</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {studentReports.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.grade}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{item.totalStudents}</td>
                        <td className="px-6 py-4 text-sm text-green-600">{item.paidStudents}</td>
                        <td className="px-6 py-4 text-sm text-red-600">{item.unpaidStudents}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{item.collectionRate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Class Reports Tab */}
        {activeTab === 'class' && (
          <div className="p-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Class-wise Financial Summary</h3>
                <button 
                  onClick={() => exportReport('class')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <i className="fas fa-file-export"></i>
                  Export
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Fees</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collected</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outstanding</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collection Rate</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {classReports.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.className}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{item.students}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">K {item.totalFees.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-green-600">K {item.collected.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-red-600">K {item.outstanding.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{item.collectionRate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Payment Reports Tab */}
        {activeTab === 'payment' && (
          <div className="p-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Payment Methods Analysis</h3>
                <button 
                  onClick={() => exportReport('payment')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <i className="fas fa-file-export"></i>
                  Export
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Count</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paymentReports.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.method}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{item.count}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">K {item.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{item.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;