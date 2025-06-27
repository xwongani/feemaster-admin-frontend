import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="admin-container min-h-screen flex bg-gradient-to-br from-blue-50 to-indigo-100">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <main className="admin-main flex-1 flex flex-col min-h-screen" id="main-content" tabIndex={-1} aria-label="Main content">
        <Header onMenuToggle={toggleSidebar} />
        <div className="flex-1 overflow-auto focus:outline-none" tabIndex={-1}>
          <div className="p-4 sm:p-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout; 