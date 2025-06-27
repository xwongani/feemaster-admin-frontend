import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAnalytics } from '../hooks/useAnalytics';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { user, userType } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { logDataAction } = useAnalytics();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Close sidebar on route change on mobile
  useEffect(() => {
    onClose?.();
  }, [location.pathname, onClose]);

  const toggleExpanded = (itemKey: string) => {
    setExpandedItems(prev => 
      prev.includes(itemKey) 
        ? prev.filter(item => item !== itemKey)
        : [...prev, itemKey]
    );
  };

  const handleNavClick = (path: string, action: string) => {
    logDataAction('view', 'page', path, { user_type: userType });
    navigate(path);
  };

  // Admin navigation items
  const adminNavItems = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: 'fas fa-tachometer-alt',
      path: '/dashboard',
      action: 'dashboard'
    },
    {
      key: 'students',
      label: 'Students',
      icon: 'fas fa-user-graduate',
      path: '/students',
      action: 'students'
    },
    {
      key: 'payments',
      label: 'Payments',
      icon: 'fas fa-credit-card',
      path: '/payments',
      action: 'payments'
    },
    {
      key: 'reports',
      label: 'Reports',
      icon: 'fas fa-chart-bar',
      path: '/reports',
      action: 'reports'
    },
    {
      key: 'schools',
      label: 'Schools',
      icon: 'fas fa-school',
      path: '/admin/schools',
      action: 'schools'
    },
    {
      key: 'parents',
      label: 'Parents',
      icon: 'fas fa-users',
      path: '/admin/parents',
      action: 'parents'
    },
    {
      key: 'fees',
      label: 'Fee Management',
      icon: 'fas fa-dollar-sign',
      path: '/admin/fees',
      action: 'fees'
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: 'fas fa-cog',
      path: '/admin/settings',
      action: 'settings'
    }
  ];

  // Parent navigation items
  const parentNavItems = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: 'fas fa-home',
      path: '/parent/dashboard',
      action: 'dashboard'
    },
    {
      key: 'children',
      label: 'My Children',
      icon: 'fas fa-child',
      path: '/parent/children',
      action: 'children'
    },
    {
      key: 'fees',
      label: 'Fee Statements',
      icon: 'fas fa-file-invoice-dollar',
      path: '/parent/fees',
      action: 'fees'
    },
    {
      key: 'payment',
      label: 'Make Payment',
      icon: 'fas fa-credit-card',
      path: '/parent/payment',
      action: 'payment'
    },
    {
      key: 'history',
      label: 'Payment History',
      icon: 'fas fa-history',
      path: '/parent/payment-history',
      action: 'history'
    },
    {
      key: 'notifications',
      label: 'Notifications',
      icon: 'fas fa-bell',
      path: '/parent/notifications',
      action: 'notifications'
    },
    {
      key: 'profile',
      label: 'Profile',
      icon: 'fas fa-user',
      path: '/parent/profile',
      action: 'profile'
    }
  ];

  const navItems = userType === 'parent' ? parentNavItems : adminNavItems;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-graduation-cap text-white text-sm" aria-hidden="true"></i>
            </div>
            <h2 className="text-xl font-bold text-gray-900">FeeMaster</h2>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close sidebar"
          >
            <i className="fas fa-times text-lg" aria-hidden="true"></i>
          </button>
        </div>

        {/* User info */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {user?.first_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {userType}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
                           (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            
            return (
              <div key={item.key}>
                <button
                  onClick={() => handleNavClick(item.path, item.action)}
                  className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <i className={`${item.icon} w-5 h-5 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} aria-hidden="true"></i>
                  <span className="flex-1 text-left">{item.label}</span>
                  {isActive && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </button>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-gray-200">
          <div className="space-y-2">
            <button
              onClick={() => {
                navigate('/help');
              }}
              className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <i className="fas fa-question-circle w-5 h-5 mr-3 text-gray-400" aria-hidden="true"></i>
              Help & Support
            </button>
            <button
              onClick={() => {
                navigate('/contact');
              }}
              className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <i className="fas fa-envelope w-5 h-5 mr-3 text-gray-400" aria-hidden="true"></i>
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 