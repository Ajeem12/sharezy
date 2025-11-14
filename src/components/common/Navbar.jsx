import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiPlusCircle,
  FiUser,
  FiMenu,
  FiX,
  FiLogIn,
  FiUserPlus,
  FiLogOut,
  FiSettings,
  FiHelpCircle,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";

const navItems = [
  { id: 1, label: "Search", icon: <FiSearch />, to: "/search" },
  { id: 2, label: "Publish Ride", icon: <FiPlusCircle />, to: "/publish" },
];

const accountItems = [
  { id: 1, label: "Dashboard", icon: <FiUser />, to: "/dashboard" },
  { id: 4, label: "Logout", icon: <FiLogOut />, to: "/logout" },
];

const authItems = [
  { id: 1, label: "Login", icon: <FiLogIn />, to: "/login" },
  { id: 2, label: "Sign Up", icon: <FiUserPlus />, to: "/signup" },
];

// Navbar animation - fast & smooth entrance from top
const navbarMountVariants = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 12,
      duration: 0.3,
      when: "beforeChildren",
      staggerChildren: 0.06,
    },
  },
  exit: { opacity: 0, y: -16, transition: { duration: 0.2 } },
};

// Navbar child items (like menu links)
const itemVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
      duration: 0.2,
    },
  },
};

// Dropdown menu appearance
const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: -4,
    scale: 0.96,
    pointerEvents: "none",
    transition: {
      duration: 0.1,
      ease: [0.4, 0, 0.2, 1], // Fast and smooth curve
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    pointerEvents: "auto",
    transition: {
      duration: 0.14,
      ease: [0.25, 0.8, 0.25, 1], // Material-style ease-out
    },
  },
  exit: {
    opacity: 0,
    y: -4,
    scale: 0.96,
    pointerEvents: "none",
    transition: {
      duration: 0.1,
      ease: [0.4, 0, 1, 1], // Ease-in fade
    },
  },
};

// Mobile menu container
const mobileMenuVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: {
    height: "auto",
    opacity: 1,
    transition: {
      duration: 0.25,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.05,
    },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.2, ease: "easeInOut" },
  },
};

// Each mobile menu item animation
const mobileItemVariants = {
  hidden: { x: -12, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 220,
      damping: 18,
      duration: 0.2,
    },
  },
  exit: { x: -12, opacity: 0, transition: { duration: 0.15 } },
};

const Navbar = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const { user, token, logout } = useAuth();
  const isLoggedIn = Boolean(token && user);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  const handleLogout = () => {
    logout();
    toast.success("You have been logged out successfully!");
    navigate("/");
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.nav
        key="navbar"
        className="bg-white border-b border-blue-100 shadow-sm sticky top-0 z-50"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={navbarMountVariants}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between md:px-8">
          <motion.div variants={itemVariants}>
            <Link to="/" className="text-2xl font-extrabold text-blue-600">
              <img className="lg:w-55 w-35" src="/logo3.png"></img>
            </Link>
          </motion.div>

          <ul className="hidden md:flex items-center space-x-8">
            {navItems.map(({ id, label, icon, to }) => (
              <motion.li key={id} variants={itemVariants}>
                <Link
                  to={to}
                  className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600"
                >
                  <span className="text-blue-500 text-xl">{icon}</span>
                  <span className="text-base font-medium">{label}</span>
                </Link>
              </motion.li>
            ))}
            <motion.li ref={dropdownRef} variants={itemVariants}>
              <motion.button
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600"
              >
                <FiUser className="text-blue-500 text-xl" />
                <span className="text-base font-medium">Account</span>
              </motion.button>
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={dropdownVariants}
                    className="absolute right-14 mt-2 w-56 bg-white rounded-lg shadow-xl border border-blue-500"
                  >
                    {isLoggedIn
                      ? accountItems.map((item) => {
                          if (item.label === "Logout") {
                            return (
                              <motion.div
                                key={item.id}
                                variants={dropdownVariants}
                              >
                                <button
                                  onClick={handleLogout}
                                  className="flex items-center rounded-lg gap-3 px-4 py-3 text-sm w-full text-left hover:bg-blue-50"
                                >
                                  <span className="text-blue-500">
                                    {item.icon}
                                  </span>
                                  {item.label}
                                </button>
                              </motion.div>
                            );
                          }
                          return (
                            <motion.div
                              key={item.id}
                              variants={dropdownVariants}
                            >
                              <Link
                                to={item.to}
                                className="flex items-center rounded-lg gap-3 px-4 py-3 text-sm hover:bg-blue-50"
                              >
                                <span className="text-blue-500">
                                  {item.icon}
                                </span>
                                {item.label}
                              </Link>
                            </motion.div>
                          );
                        })
                      : authItems.map((item) => (
                          <motion.div key={item.id} variants={dropdownVariants}>
                            <Link
                              to={item.to}
                              className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-blue-50"
                            >
                              <span className="text-blue-500">{item.icon}</span>
                              {item.label}
                            </Link>
                          </motion.div>
                        ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          </ul>

          <motion.div className="md:hidden" variants={itemVariants}>
            <motion.button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-700"
            >
              {isMobileMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </motion.button>
          </motion.div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.ul
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={mobileMenuVariants}
              className="md:hidden bg-white border-t border-gray-100 px-4 pb-4"
            >
              {navItems.map(({ id, label, icon, to }) => (
                <motion.li key={id} variants={mobileItemVariants}>
                  <Link
                    to={to}
                    className="flex items-center gap-3 py-3 text-gray-700 hover:text-blue-600"
                  >
                    <span className="text-blue-500 text-lg">{icon}</span>
                    {label}
                  </Link>
                </motion.li>
              ))}
              {(isLoggedIn ? accountItems : authItems).map(
                ({ id, label, icon, to }) => {
                  if (label === "Logout") {
                    return (
                      <motion.li key={id} variants={mobileItemVariants}>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 py-3 text-gray-700 hover:text-blue-600 w-full text-left"
                        >
                          <span className="text-blue-500 text-lg">{icon}</span>
                          {label}
                        </button>
                      </motion.li>
                    );
                  }
                  return (
                    <motion.li key={id} variants={mobileItemVariants}>
                      <Link
                        to={to}
                        className="flex items-center gap-3 py-3 text-gray-700 hover:text-blue-600"
                      >
                        <span className="text-blue-500 text-lg">{icon}</span>
                        {label}
                      </Link>
                    </motion.li>
                  );
                }
              )}
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.nav>
    </AnimatePresence>
  );
};

export default Navbar;
