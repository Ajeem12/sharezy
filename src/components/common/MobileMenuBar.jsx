import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  MdHome,
  MdHomeFilled,
  MdSearch,
  MdSearchOff,
  MdAddCircleOutline,
  MdAddCircle,
  MdPerson,
  MdPersonOutline,
} from 'react-icons/md';

const MobileMenuBar = () => {
  const { pathname } = useLocation();

  const navItems = [
    {
      label: 'Home',
      path: '/',
      icon: pathname === '/' ? <MdHomeFilled className="w-7 h-7" /> : <MdHome className="w-7 h-7" />,
    },
    {
      label: 'Search',
      path: '/search',
      icon: pathname === '/search' ? <MdSearch className="w-7 h-7" /> : <MdSearchOff className="w-7 h-7" />,
    },
    {
      label: 'Publish',
      path: '/publish',
      icon: pathname === '/publish' ? <MdAddCircle className="w-7 h-7" /> : <MdAddCircleOutline className="w-7 h-7" />,
    },
    {
      label: 'Profile',
      path: '/dashboard',
      icon: pathname === '/dashboard' ? <MdPerson className="w-7 h-7" /> : <MdPersonOutline className="w-7 h-7" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-md border-t border-gray-300 lg:hidden z-50">
      <div className="flex justify-around items-center py-3">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              aria-label={item.label}
              className={`flex flex-col items-center transition ${
                isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1 select-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileMenuBar;
