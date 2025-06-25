import React from 'react';
import Layout from '../components/Layout';
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';

const ParentPortalLayout: React.FC = () => {
  return (
    <div>
      <Header />
      <div style={{ maxWidth: 600, margin: '40px auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: 32 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default ParentPortalLayout; 