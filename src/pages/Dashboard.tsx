import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '../services/api';
import { useAnalytics } from '../hooks/useAnalytics';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
// import TestSentry from '../components/TestSentry';

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
  const navigate = useNavigate();
  const { logDataAction } = useAnalytics();
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
  const [refreshing, setRefreshing] = useState(false);

  // Use standard React environment variable access
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/v1';

  useEffect(() => {
    fetchAllDashboardData();
  }, []);

  const fetchAllDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await Promise.all([
        fetchDashboardStats(),
        fetchGradeProgress(),
        fetchRevenueChart(),
        fetchQuickActions()
      ]);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load some dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllDashboardData();
    setRefreshing(false);
  };

  const fetchDashboardStats = async () => {
    try {
      const data = await dashboardApi.getStats();
      setStats(data);
      logDataAction('view', 'dashboard_stats', 'dashboard');
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      // Keep fallback data
    }
  };

  const fetchGradeProgress = async () => {
    try {
      const data = await dashboardApi.getGradeDistribution();
      setGradeProgress(data);
      logDataAction('view', 'grade_progress', 'dashboard');
    } catch (err) {
      console.error('Error fetching grade progress:', err);
      // Use fallback data
      setGradeProgress([
        { grade: 'Grade 7A', students: 15, progress: 87 },
        { grade: 'Grade 7B', students: 14, progress: 92 },
        { grade: 'Grade 8A', students: 18, progress: 78 },
      ]);
    }
  };

  const fetchRevenueChart = async () => {
    try {
      const data = await dashboardApi.getRevenueChart('week');
      setChartData(data);
      logDataAction('view', 'revenue_chart', 'dashboard');
    } catch (err) {
      console.error('Error fetching revenue chart:', err);
      // Keep existing chart data
    }
  };

  const fetchQuickActions = async () => {
    try {
      const data = await dashboardApi.getQuickActions();
      setQuickActions(data);
      logDataAction('view', 'quick_actions', 'dashboard');
    } catch (err) {
      console.error('Error fetching quick actions:', err);
      // Keep existing quick actions
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
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
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      completed: 'status-paid',
      pending: 'status-pending',
      failed: 'status-failed'
    };
    const statusText = {
      completed: 'Completed',
      pending: 'Pending',
      failed: 'Failed'
    };
    return (
      <span className={`status-badge ${statusClasses[status as keyof typeof statusClasses]}`}>
        {statusText[status as keyof typeof statusText]}
      </span>
    );
  };

  const getQuickActionColor = (color: string) => {
    const colorClasses = {
      blue: 'bg-gradient-to-br from-blue-500 to-blue-600',
      green: 'bg-gradient-to-br from-green-500 to-green-600',
      yellow: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
      purple: 'bg-gradient-to-br from-purple-500 to-purple-600',
      indigo: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
      gray: 'bg-gradient-to-br from-gray-500 to-gray-600'
    };
    return colorClasses[color as keyof typeof colorClasses] || 'bg-gradient-to-br from-blue-500 to-blue-600';
  };

  const handleQuickActionClick = (href: string, actionTitle: string) => {
    navigate(href);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <LoadingSpinner size="xl" text="Loading dashboard..." />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" role="main" aria-label="Dashboard">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Today: {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          {stats.current_academic_year && (
            <p className="text-sm text-gray-500 mt-1">
              Academic Year: {stats.current_academic_year} - {stats.current_academic_term}
            </p>
          )}
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="mt-4 sm:mt-0 secondary-btn focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Refresh dashboard data"
        >
          <i className={`fas fa-sync-alt mr-2 ${refreshing ? 'animate-spin' : ''}`} aria-hidden="true"></i>
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <Alert
          type="warning"
          title="Dashboard Data"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      {/* Stats Cards */}
      <div className="stats-container" role="region" aria-label="Dashboard statistics">
        <div className="stat-card" tabIndex={0} aria-label={`Total collections: K ${stats.total_collections.toLocaleString()}.00`}>
          <div className="stat-icon payment-icon">
            <i className="fas fa-file-invoice-dollar" aria-hidden="true"></i>
          </div>
          <div className="flex-1">
            <div className="stat-value">K {stats.total_collections.toLocaleString()}.00</div>
            <div className="stat-label">Total Collections</div>
            <div className="stat-period">This Month</div>
          </div>
        </div>

        <div className="stat-card" tabIndex={0} aria-label={`Total students: ${stats.total_students}`}>
          <div className="stat-icon student-icon">
            <i className="fas fa-user-graduate" aria-hidden="true"></i>
          </div>
          <div className="flex-1">
            <div className="stat-value">{stats.total_students}</div>
            <div className="stat-label">Total Students</div>
            <div className="stat-period">Enrolled</div>
          </div>
        </div>

        <div className="stat-card" tabIndex={0} aria-label={`Pending payments: K ${stats.pending_payments.toLocaleString()}.00`}>
          <div className="stat-icon pending-icon">
            <i className="fas fa-hourglass-half" aria-hidden="true"></i>
          </div>
          <div className="flex-1">
            <div className="stat-value">K {stats.pending_payments.toLocaleString()}.00</div>
            <div className="stat-label">Pending Payments</div>
            <div className="stat-period">Outstanding</div>
          </div>
        </div>

        <div className="stat-card" tabIndex={0} aria-label={`Receipts generated: ${stats.receipts_generated}`}>
          <div className="stat-icon receipt-icon">
            <i className="fas fa-receipt" aria-hidden="true"></i>
          </div>
          <div className="flex-1">
            <div className="stat-value">{stats.receipts_generated}</div>
            <div className="stat-label">Receipts Generated</div>
            <div className="stat-period">This Month</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-card" role="region" aria-label="Quick actions">
        <div className="card-header">
          <h2>Quick Actions</h2>
          <p className="text-sm text-gray-500">Common tasks and shortcuts</p>
        </div>
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleQuickActionClick(action.href, action.title)}
              className="quick-action-card focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`${action.title}${action.count ? ` (${action.count} items)` : ''}`}
            >
              <div className={`quick-action-icon ${getQuickActionColor(action.color)}`}>
                <i className={action.icon} aria-hidden="true"></i>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                {action.title}
              </h3>
              {action.count && (
                <span className="notification-badge" aria-label={`${action.count} items`}>
                  {action.count > 9 ? '9+' : action.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Section */}
        <div className="dashboard-card" role="region" aria-label="Daily revenue chart">
          <div className="card-header">
            <h2>Daily Revenue</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Last 7 days</span>
            </div>
          </div>
          <div className="chart-container" aria-label="Revenue chart showing daily collections">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Grade Progress */}
        <div className="dashboard-card" role="region" aria-label="Grade payment progress">
          <div className="card-header">
            <h2>Grade Payment Progress</h2>
            <span className="text-sm text-gray-500">Collection rates by grade</span>
          </div>
          <div className="space-y-6">
            {gradeProgress.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">{item.grade}</h3>
                  <span className="text-sm font-medium text-gray-700">{item.progress}%</span>
                </div>
                <p className="text-xs text-gray-500">{item.students} students</p>
                <div className="progress-bar" role="progressbar" aria-valuenow={item.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`${item.grade} payment progress: ${item.progress}%`}>
                  <div 
                    className="progress-fill" 
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Payment Activities */}
      <div className="dashboard-card" role="region" aria-label="Recent payment activities">
        <div className="card-header">
          <h2>Recent Payment Activities</h2>
          <button 
            onClick={() => {
              navigate('/payments');
            }}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="View all payments"
          >
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table" role="table" aria-label="Recent payment activities">
            <thead>
              <tr>
                <th scope="col">Student</th>
                <th scope="col">Payment Type</th>
                <th scope="col">Amount</th>
                <th scope="col">Date</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent_activities.length > 0 ? (
                stats.recent_activities.map((activity) => (
                  <tr key={activity.id}>
                    <td>
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                            {activity.initials}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">{activity.student_name}</div>
                          <div className="text-sm text-gray-500">ID: {activity.student_id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-sm text-gray-900">{activity.payment_type}</td>
                    <td className="text-sm font-semibold text-gray-900">K {activity.amount.toLocaleString()}.00</td>
                    <td className="text-sm text-gray-900">{activity.date}</td>
                    <td>{getStatusBadge(activity.status)}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button 
                          className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                          title="View Details"
                          aria-label={`View details for ${activity.student_name}'s payment`}
                        >
                          <i className="fas fa-eye" aria-hidden="true"></i>
                        </button>
                        <button 
                          className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500" 
                          title="Print Receipt"
                          aria-label={`Print receipt for ${activity.student_name}'s payment`}
                        >
                          <i className="fas fa-print" aria-hidden="true"></i>
                        </button>
                        {activity.status === 'pending' && (
                          <button 
                            className="p-1 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500" 
                            title="Approve Payment"
                            aria-label={`Approve payment for ${activity.student_name}`}
                          >
                            <i className="fas fa-check" aria-hidden="true"></i>
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
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <i className="fas fa-file-invoice text-gray-400 text-2xl" aria-hidden="true"></i>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recent Activities</h3>
                      <p className="text-gray-500 max-w-sm">
                        Payment activities will appear here once transactions are recorded.
                      </p>
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