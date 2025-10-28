import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { MdVerifiedUser } from "react-icons/md";
import { MdBadge } from "react-icons/md";
import {
  MdPerson,
  MdPayment,
  MdBarChart,
  MdSupportAgent,
  MdExitToApp,
  MdMenu,
  MdClose,
  MdDashboard,
  MdDirectionsCar,
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <MdDashboard size={20} />,
    path: "/admin",
  },
  {
    id: "userlist",
    label: "User Management",
    icon: <MdPerson size={20} />,
    path: "/admin/userlist",
  },
  {
    id: "reports",
    label: "Commission Reports",
    icon: <MdBarChart size={20} />,
    path: "/admin/commission",
  },
  {
    id: "support",
    label: "Support Panel",
    icon: <MdSupportAgent size={20} />,
    path: "/admin/support",
  },
  {
    id: "allrides",
    label: "All Rides",
    icon: <MdDirectionsCar size={20} />,
    path: "/admin/allrides",
  },
  {
    id: "kyclist",
    label: "KYCList",
    icon: <MdVerifiedUser size={20} />,
    path: "/admin/kyclist",
  },
  // { id: 'KycDetail', label: 'KycDetail', icon: <MdBadge size={20} />, path: '/admin/KycDetail' },

  {
    id: "logout",
    label: "Logout",
    icon: <MdExitToApp size={20} />,
    path: "/logout",
  },
];

const AdminSidebar = ({ collapsed, onToggle, mobileOpen }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarWidth = !collapsed || mobileOpen ? 260 : 80;

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && isMobile && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 z-20 lg:hidden"
            onClick={onToggle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className="fixed lg:sticky top-0 left-0 z-30 bg-white h-screen shadow-lg border-r overflow-hidden"
        initial={false}
        animate={{ width: sidebarWidth }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Header (mobile and desktop) */}
        <div className="flex items-center justify-between lg:justify-center px-4 py-3 border-b">
          <motion.h1
            className="text-xl font-bold text-blue-600 hidden lg:block"
            animate={{ opacity: !collapsed || mobileOpen ? 1 : 0 }}
          >
            Admin
          </motion.h1>

          {/* Mobile toggle */}
          <div className="lg:hidden">
            <button
              onClick={onToggle}
              className="text-gray-600 hover:text-gray-800"
            >
              <MdClose size={24} />
            </button>
          </div>

          {/* Collapse button (desktop only) */}
          <div className="hidden lg:block absolute top-3 right-3">
            <button
              onClick={onToggle}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            >
              {collapsed ? <MdMenu size={20} /> : <MdClose size={20} />}
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1">
          {links.map(({ id, label, icon, path }) => (
            <NavLink
              to={path}
              key={id}
              end
              className={({ isActive }) =>
                `flex items-center py-3 px-3 rounded-lg transition-all duration-150 ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-gray-600 hover:bg-gray-100"
                } ${collapsed && !mobileOpen ? "justify-center" : "space-x-3"}`
              }
            >
              <span>{icon}</span>
              <AnimatePresence initial={false}>
                {(!collapsed || mobileOpen) && (
                  <motion.span
                    key={label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>
      </motion.aside>
    </>
  );
};

export default AdminSidebar;
