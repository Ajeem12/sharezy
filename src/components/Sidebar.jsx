import React, { useEffect } from "react";
import { FaWallet } from "react-icons/fa";
import { FaUserCheck } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import {
  MdPerson,
  MdDirectionsBike,
  MdEventSeat,
  MdExitToApp,
  MdHome,
  MdAddCircleOutline,
  MdAttachMoney,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../redux/features/profile/profileSlice";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
const menuItems = [
  { id: "home", label: "Home", icon: <MdHome />, path: "/" },
  {
    id: "profile",
    label: "Profile Info",
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
    label: "Booked Rides",
    icon: <MdEventSeat />,
    path: "/dashboard/booked",
  },
  {
    id: "kyc",
    label: "KYC",
    icon: <FaUserCheck />,
    path: "/dashboard/kyc",
  },
  // {
  //   id: "kycInfo",
  //   label: "KYCInfo",
  //   icon: <FaUserCheck />,
  //   path: "/dashboard/kycInfo",
  // },
  // {
  //   id: "wallet",
  //   label: "Wallet",
  //   icon: <FaWallet />,
  //   path: "/dashboard/wallet",
  // },
  // {
  //   id: "commission",
  //   label: "Commission",
  //   icon: <MdAttachMoney />,
  //   path: "/dashboard/commissionreport",
  // },

  { id: "logout", label: "Logout", icon: <MdExitToApp /> },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { data: formData } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleLogout = () => {
    logout();
    toast.success("You have been logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="py-6">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 h-screen rounded bg-white shadow-lg sticky top-0 border border-blue-100">
        <div className="flex flex-col h-full p-4">
          {/* Header */}
          <div className="px-4 py-6 mb-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">User Dashboard</h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            <ul className="space-y-2">
              {menuItems.map(({ id, label, icon, path }) => {
                if (id === "home" || id === "publish") return null;

                if (id === "logout") {
                  return (
                    <li key={id}>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-all duration-200"
                      >
                        <span className="text-xl">{icon}</span>
                        <span>{label}</span>
                      </button>
                    </li>
                  );
                }

                return (
                  <li key={id}>
                    <NavLink
                      to={path}
                      end
                      className={({ isActive }) => `
                        flex items-center gap-3 px-4 py-3 rounded-lg
                        transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                        ${
                          isActive
                            ? "bg-blue-50 text-blue-600 font-semibold"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }
                      `}
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

      {/* Mobile Footer Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
        <ul className="flex justify-around">
          {menuItems.map(({ id, label, icon, path }) => {
            if (id === "settings" || id === "logout") return null;
            return (
              <li key={id} className="flex-1">
                <NavLink
                  to={path}
                  end
                  className={({ isActive }) =>
                    `flex flex-col items-center justify-center py-2.5 
      text-xs ${isActive ? "text-blue-600" : "text-gray-600"}`
                  }
                >
                  <span className="text-2xl">{icon}</span>
                  <span className="text-[10px] leading-tight">{label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Spacer for mobile nav */}
      <div className="md:hidden pb-16" />
    </div>
  );
};

export default Sidebar;
