import React, { useEffect, useState } from "react";
import { FaWallet, FaUserCheck } from "react-icons/fa";
import {
  MdPerson,
  MdDirectionsBike,
  MdEventSeat,
  MdExitToApp,
  MdHome,
  MdAddCircleOutline,
  MdMenu,
} from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../redux/features/profile/profileSlice";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { fetchWalletList } from "../redux/features/profile/walletSlice";

const menuItems = [
  { id: "home", label: "Home", icon: <MdHome />, path: "/" },
  {
    id: "profile",
    label: "Profile",
    icon: <MdPerson />,
    path: "/dashboard/profile",
  },
  {
    id: "publish",
    label: "Publish",
    icon: <MdAddCircleOutline />,
    path: "/publish",
  },
  {
    id: "rides",
    label: "My Rides",
    icon: <MdDirectionsBike />,
    path: "/dashboard/myrides",
  },
  {
    id: "booked",
    label: "Booked",
    icon: <MdEventSeat />,
    path: "/dashboard/booked",
  },
  { id: "kyc", label: "KYC", icon: <FaUserCheck />, path: "/dashboard/kyc" },
  {
    id: "wallet",
    label: "Wallet",
    icon: <FaWallet />,
    path: "/dashboard/wallet",
  },
  { id: "logout", label: "Logout", icon: <MdExitToApp /> },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { data: formData } = useSelector((state) => state.profile);
  const [showMore, setShowMore] = useState(false);

  const { walletHistory } = useSelector((state) => state.wallet);

  useEffect(() => {
    dispatch(fetchWalletList());
  }, [dispatch]);

  const totalBalance = walletHistory.reduce(
    (sum, x) => sum + Number(x?.payment_amount || 0),
    0
  );

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleLogout = () => {
    logout();
    toast.success("You have been logged out successfully!");
    navigate("/login");
  };

  // Separate main & extra items for mobile
  const mainItems = menuItems.filter((item) =>
    ["home", "rides", "wallet", "profile"].includes(item.id)
  );
  const extraItems = menuItems.filter(
    (item) => !["home", "rides", "wallet", "profile"].includes(item.id)
  );

  return (
    <div className="py-6">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 h-screen rounded bg-white shadow-lg sticky top-0 border border-blue-100">
        <div className="flex flex-col h-full p-4">
          <div className="px-4 py-6 mb-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">User Dashboard</h2>
          </div>

          {/* Desktop Nav */}
          <nav className="flex-1">
            <ul className="space-y-2">
              {menuItems.map(({ id, label, icon, path }) => {
                if (id === "home" || id === "publish") return null;

                if (id === "logout") {
                  return (
                    <li key={id}>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-all"
                      >
                        <span className="text-xl">{icon}</span>
                        <span>{label}</span>
                      </button>
                    </li>
                  );
                }

                if (id === "wallet") {
                  return (
                    <li key={id}>
                      <NavLink
                        to={path}
                        end
                        className={({ isActive }) =>
                          `flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all ${
                            isActive
                              ? "bg-blue-50 text-blue-600 font-semibold"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`
                        }
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{icon}</span>
                          <span>{label}</span>
                        </div>
                        <div className="relative flex items-center justify-center">
                          <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-md shadow-sm">
                            ₹ {totalBalance || 0}
                          </span>
                          <span className="absolute inline-flex h-full w-full rounded-md bg-blue-400 opacity-10 animate-ping"></span>
                        </div>
                      </NavLink>
                    </li>
                  );
                }

                return (
                  <li key={id}>
                    <NavLink
                      to={path}
                      end
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          isActive
                            ? "bg-blue-50 text-blue-600 font-semibold"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`
                      }
                    >
                      <span className="text-xl">{icon}</span>
                      <span>{label}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="mt-auto p-4 border-t border-gray-100">
            <div className="flex items-center">
              <div className="w-10 h-10 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <MdPerson size={20} className="text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-gray-800 truncate">
                  {formData?.name || "Guest User"}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {formData?.email || "guest@example.com"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/*  Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg rounded-t-2xl">
        <ul className="flex justify-around items-center py-2">
          {mainItems.map(({ id, label, icon, path }) => (
            <li key={id} className="flex-1">
              <NavLink
                to={path}
                end
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center text-xs font-medium transition-all duration-150 ${
                    isActive ? "text-blue-600" : "text-gray-600"
                  }`
                }
              >
                <span className="text-2xl">{icon}</span>
                <span className="text-[10px]">{label}</span>
              </NavLink>
            </li>
          ))}

          {/* Floating More Button */}
          <li className="absolute -top-5 left-1/2 -translate-x-1/2">
            <button
              onClick={() => setShowMore(!showMore)}
              className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all"
            >
              {showMore ? (
                <RxCross2 className="text-3xl" />
              ) : (
                <MdMenu className="text-3xl" />
              )}
            </button>
          </li>
        </ul>
      </nav>

      {/* Popup for More Menu */}
      <AnimatePresence>
        {showMore && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMore(false)}
            />
            {/* Popup Sheet */}
            <motion.div
              className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-2xl z-50 p-4 w-11/12 max-w-sm"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
            >
              <h3 className="text-gray-800 font-semibold mb-3 text-center">
                More Options
              </h3>
              <ul className="grid grid-cols-2 gap-3">
                {extraItems.map(({ id, label, icon, path }) =>
                  id === "logout" ? (
                    <li key={id}>
                      <button
                        onClick={handleLogout}
                        className="w-full flex flex-col items-center p-3 bg-gray-50 hover:bg-red-50 text-gray-700 hover:text-red-600 rounded-xl"
                      >
                        <span className="text-2xl mb-1">{icon}</span>
                        <span className="text-xs font-medium">{label}</span>
                      </button>
                    </li>
                  ) : (
                    <li key={id}>
                      <NavLink
                        to={path}
                        className="flex flex-col items-center p-3 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-xl"
                        onClick={() => setShowMore(false)}
                      >
                        <span className="text-2xl mb-1">{icon}</span>
                        <span className="text-xs font-medium">{label}</span>
                      </NavLink>
                    </li>
                  )
                )}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for mobile nav */}
      <div className="md:hidden pb-20" />
    </div>
  );
};

export default Sidebar;
