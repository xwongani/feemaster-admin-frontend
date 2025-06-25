import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleMenuClick = (path: string) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="admin-header flex items-center justify-between relative">
      {/* Hamburger menu for login options */}
      <div className="relative">
        <button
          className="p-2 focus:outline-none"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Open menu"
        >
          <i className="fas fa-bars text-2xl text-gray-700"></i>
        </button>
        {menuOpen && (
          <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => handleMenuClick('/login')}
            >
              Admin Login
            </button>
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => handleMenuClick('/parent-portal')}
            >
              Parent Portal
            </button>
          </div>
        )}
      </div>
      <div className="flex-1"></div>
    </header>
  );
};

export default Header; 