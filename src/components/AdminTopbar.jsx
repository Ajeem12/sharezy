import React, { useState, useRef, useEffect } from 'react';
import { MdMenu, MdLogout, MdPerson, MdClose } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { toast } from "sonner";
const AdminTopbar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {

  const { adminLogout } = useAuth();

  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    adminLogout(); // Assuming adminLogout is a function to clear the session
    setProfileOpen(false); // Close the profile dropdown

    // Show toast notification
    toast.success("You have successfully logged out!", { position: "top-right" });
  };

  

  return (
    <header
      className="fixed top-0 left-0 right-0 h-14 bg-white shadow-md flex items-center px-4 z-60"
      style={{ paddingLeft: collapsed ? '20px' : '20px', transition: 'padding-left 0.3s ease' }}
    >
      {/* Mobile toggle */}
      <button
        className="text-blue-600 lg:hidden mr-4 hover:text-blue-800 transition"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? (
          <MdClose className="text-2xl" />
        ) : (
          <MdMenu className="text-2xl" />
        )}
      </button>

      {/* Desktop toggle */}
      <button
        className="hidden lg:block text-blue-600 hover:text-blue-800 transition"
        onClick={() => setCollapsed(!collapsed)}
        aria-label="Toggle sidebar collapse"
      >
        {collapsed ? (
          <MdMenu className="text-2xl" />
        ) : (
          <MdClose className="text-2xl" />
        )}
      </button>

   <Link to="/admin" className="ml-4 text-lg font-semibold text-blue-600 flex-grow select-none">
  Admin Dashboard
</Link>


      {/* Profile section */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="flex items-center text-blue-600 hover:text-blue-800 focus:outline-none transition"
          aria-label="User menu"
        >
          <MdPerson className="text-3xl rounded-full border-2 border-blue-500 p-1 hover:bg-blue-100 transition" />
        </button>

        {/* Animated dropdown using framer-motion */}
        <AnimatePresence>
          {profileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-40 bg-white border border-blue-200 rounded shadow-lg py-2 z-50"
            >
              <Link
                to="/admin/login" // 👈 Redirect to admin login after logout
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 hover:text-blue-800 transition"
                onClick={handleLogout}
              >
                <MdLogout className="text-lg" />
                Logout
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default AdminTopbar;
