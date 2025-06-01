import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface RecentActivity {
  id: string;
  student_name: string;
  student_id: string;
  initials: string;
  payment_type: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

interface GradeProgress {
  grade: string;
  students: number;
  progress: number;
}

interface ChartData {
  labels: string[];
  datasets: any[];
}

interface QuickAction {
  title: string;
  icon: string;
  count?: number;
  href: string;
  color: string;
}

interface DashboardStats {
  total_collections: number;
  total_students: number;
  pending_payments: number;
  receipts_generated: number;
  collection_rate: number;
  recent_activities: RecentActivity[];
  current_academic_year: string;
  current_academic_term: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    total_collections: 0,
    total_students: 0,
    pending_payments: 0,
    receipts_generated: 0,
    collection_rate: 0,
    recent_activities: [],
    current_academic_year: '2024/2025',
    current_academic_term: 'Term 1'
  });
  const [gradeProgress, setGradeProgress] = useState<GradeProgress[]>([]);
  const [chartData, setChartData] = useState<ChartData>({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Daily Revenue',
      data: [12000, 19000, 15000, 25000, 22000, 18000, 24000],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
    }]
  });
  const [quickActions, setQuickActions] = useState<QuickAction[]>([
    { title: 'Register New Student', icon: 'fas fa-user-plus', href: '/students/new', color: 'blue' },
    { title: 'Record Payment', icon: 'fas fa-dollar-sign', href: '/payments/new', color: 'green' },
    { title: 'Send Payment Reminders', icon: 'fas fa-bell', href: '/reminders', color: 'yellow' },
    { title: 'Generate Reports', icon: 'fas fa-chart-bar', href: '/reports', color: 'purple' },
    { title: 'Upload CSV', icon: 'fas fa-upload', href: '/import', color: 'indigo' },
    { title: 'Manage Integrations', icon: 'fas fa-cogs', href: '/settings/integrations', color: 'gray' }
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use standard React environment variable access
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/v1';

  useEffect(() => {
    fetchAllDashboardData();
  }, []);

  const fetchAllDashboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchDashboardStats(),
        fetchGradeProgress(),
        fetchRevenueChart(),
        fetchQuickActions()
      ]);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load some dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch dashboard stats');
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    }
  };

  const fetchGradeProgress = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/grade-distribution`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setGradeProgress(result.data);
          return;
        }
      }
    } catch (err) {
      console.error('Error fetching grade progress:', err);
    }
    
    // Use fallback data
    setGradeProgress([
      { grade: 'Grade 7A', students: 15, progress: 87 },
      { grade: 'Grade 7B', students: 14, progress: 92 },
      { grade: 'Grade 8A', students: 18, progress: 78 },
    ]);
  };

  const fetchRevenueChart = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/revenue-chart?period=week`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setChartData(result.data);
          return;
        }
      }
    } catch (err) {
      console.error('Error fetching revenue chart:', err);
    }
  };

  const fetchQuickActions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/quick-actions`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setQuickActions(result.data);
        }
      }
    } catch (err) {
      console.error('Error fetching quick actions:', err);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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

  const getQuickActionColor = (color: string) => {
    const colorClasses = {
      blue: 'bg-blue-100 group-hover:bg-blue-200 text-blue-600',
      green: 'bg-green-100 group-hover:bg-green-200 text-green-600',
      yellow: 'bg-yellow-100 group-hover:bg-yellow-200 text-yellow-600',
      purple: 'bg-purple-100 group-hover:bg-purple-200 text-purple-600',
      indigo: 'bg-indigo-100 group-hover:bg-indigo-200 text-indigo-600',
      gray: 'bg-gray-100 group-hover:bg-gray-200 text-gray-600'
    };
    return colorClasses[color as keyof typeof colorClasses] || 'bg-blue-100 group-hover:bg-blue-200 text-blue-600';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-lg">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Today: {new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</p>
        {stats.current_academic_year && (
          <p className="text-sm text-gray-500">Academic Year: {stats.current_academic_year} - {stats.current_academic_term}</p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <i className="fas fa-exclamation-triangle text-yellow-400"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <i className="fas fa-file-invoice-dollar text-white text-xl"></i>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Collections</h3>
              <div className="text-2xl font-bold text-gray-900">K {stats.total_collections.toLocaleString()}.00</div>
              <div className="text-sm text-gray-500">This Month</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <i className="fas fa-user-graduate text-white text-xl"></i>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
              <div className="text-2xl font-bold text-gray-900">{stats.total_students}</div>
              <div className="text-sm text-gray-500">Enrolled</div>
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
              <h3 className="text-sm font-medium text-gray-500">Pending Payments</h3>
              <div className="text-2xl font-bold text-gray-900">K {stats.pending_payments.toLocaleString()}.00</div>
              <div className="text-sm text-gray-500">Outstanding</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <i className="fas fa-receipt text-white text-xl"></i>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Receipts Generated</h3>
              <div className="text-2xl font-bold text-gray-900">{stats.receipts_generated}</div>
              <div className="text-sm text-gray-500">This Month</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - MOVED TO TOP */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action, index) => (
              <a
                key={index}
                href={action.href}
                className="flex flex-col items-center p-4 text-center bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors group relative"
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${getQuickActionColor(action.color)}`}>
                  <i className={`${action.icon} text-xl`}></i>
                </div>
                <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                  {action.title}
                </span>
                {action.count && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {action.count}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Chart Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-4">
            <h2 className="text-lg font-medium text-gray-900">Daily Revenue</h2>
          </div>
          <div style={{ height: '300px' }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Grade Progress */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-4">
            <h2 className="text-lg font-medium text-gray-900">Grade Payment Progress</h2>
          </div>
          <div className="space-y-4">
            {gradeProgress.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-gray-900">{item.grade}</h3>
                    <span className="text-sm text-gray-500">{item.progress}% Paid</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{item.students} students</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Payment Activities */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Recent Payment Activities</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recent_activities.length > 0 ? (
                stats.recent_activities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-sm">
                            {activity.initials}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{activity.student_name}</div>
                          <div className="text-sm text-gray-500">ID: {activity.student_id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{activity.payment_type}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">K {activity.amount.toLocaleString()}.00</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{activity.date}</td>
                    <td className="px-6 py-4">{getStatusBadge(activity.status)}</td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button className="text-blue-600 hover:text-blue-900" title="View">
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className="text-green-600 hover:text-green-900" title="Print">
                          <i className="fas fa-print"></i>
                        </button>
                        {activity.status === 'pending' && (
                          <button className="text-yellow-600 hover:text-yellow-900" title="Approve">
                            <i className="fas fa-check"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <i className="fas fa-file-invoice text-gray-300 text-4xl mb-4"></i>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Activities</h3>
                      <p className="text-gray-500">Payment activities will appear here once transactions are recorded.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 