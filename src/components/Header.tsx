import React, { useState } from 'react';

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="admin-header">
      <div className="header-search">
        <i className="fas fa-search text-gray-400"></i>
        <input 
          type="text" 
          placeholder="Search students, payments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="header-actions flex items-center space-x-4">
        <button className="relative p-2 text-gray-600 hover:text-gray-900">
          <i className="fas fa-bell text-xl"></i>
          <span className="notification-badge">3</span>
        </button>
        <button className="primary-btn">
          <i className="fas fa-plus mr-2"></i>
          New Payment
        </button>
      </div>
    </header>
  );
};

export default Header; 