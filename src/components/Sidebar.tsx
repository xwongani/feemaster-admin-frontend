import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { signOut } = useAuth();

  const navItems = [
    { path: '/dashboard', icon: 'fas fa-home', label: 'Dashboard' },
    { path: '/students', icon: 'fas fa-user-graduate', label: 'Students' },
    { path: '/payments', icon: 'fas fa-money-bill-wave', label: 'Payments' },
    { path: '/financial-dashboard', icon: 'fas fa-chart-line', label: 'Financial Dashboard' },
    { path: '/reports', icon: 'fas fa-file-alt', label: 'Reports' },
    { path: '/integrations', icon: 'fas fa-plug', label: 'Integrations' },
    { path: '/settings', icon: 'fas fa-cog', label: 'Settings' },
  ];

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <div className="logo-placeholder">
          <i className="fas fa-graduation-cap"></i>
        </div>
        <h1 className="text-xl font-bold text-gray-900">Fee Master</h1>
      </div>
      
      <nav className="sidebar-nav flex-1">
        <ul>
          {navItems.map((item) => (
            <li 
              key={item.path} 
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <NavLink to={item.path}>
                <i className={item.icon}></i>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="sidebar-footer p-4 border-t border-gray-200">
        <div className="user-info mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
              <i className="fas fa-user-circle text-gray-600"></i>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">Admin User</div>
              <div className="text-xs text-gray-500">Administrator</div>
            </div>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <i className="fas fa-sign-out-alt mr-3"></i>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar; 