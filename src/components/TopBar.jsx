// components/TopBar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiBell, FiUser, FiMenu } from 'react-icons/fi';


const TopBar = ({ onMenuClick }) => {

  


  return (
    <header className="flex items-center justify-between bg-white border-b border-gray-200 px-6 h-16 sticky top-0 z-99999 shadow-sm">
      {/* Left: Menu button and title */}
      <div className="flex items-center space-x-4">
        {/* Hamburger menu button (for smaller screens) */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
          aria-label="Toggle menu"
        >
          <FiMenu size={24} />
        </button>

        {/* Dashboard title linked to /admin */}
        <Link
          to="/admin"
          className="text-2xl font-semibold text-blue-700 hover:text-blue-900"
        >
          Admin Dashboard
        </Link>
      </div>

      {/* Right: Notification and User icons */}
      <div className="flex items-center space-x-6">
        <button
          aria-label="Notifications"
          className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <FiBell size={24} />
          {/* Notification badge */}
          <span className="absolute top-1 right-1 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <button
          aria-label="User Profile"
          className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <FiUser size={24} />
        </button>
      </div>
    </header>
  );
};

export default TopBar;
