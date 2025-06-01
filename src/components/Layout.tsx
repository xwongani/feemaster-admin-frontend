import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout: React.FC = () => {
  return (
    <div className="admin-container">
      <Sidebar />
      <main className="admin-main">
        <Header />
        <div className="p-6 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout; 