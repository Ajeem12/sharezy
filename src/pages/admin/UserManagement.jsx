import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FiMail, FiSearch, FiEye, FiFileText } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import { fetchUsers } from "../../redux/features/admin/userSlice";
import {
  changeUserStatus,
  resetUserStatusState,
} from "../../redux/features/admin/userStatusSlice";
import SharezyLoader from "../../components/SharezyLoader";

const UserManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { users, loading, error } = useSelector((state) => state.users);
  const { success, error: statusError } = useSelector((state) => state.userStatus);

  const [filterText, setFilterText] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      toast.success("User status updated successfully");
    }
    if (statusError) {
      toast.error(typeof statusError === "string" ? statusError : "Failed to update user status");
    }

    const timer = setTimeout(() => {
      dispatch(resetUserStatusState());
    }, 3000);

    return () => clearTimeout(timer);
  }, [success, statusError, dispatch]);

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(filterText.toLowerCase()) ||
      user.email?.toLowerCase().includes(filterText.toLowerCase())
  );

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      cell: (row) => <span className="font-semibold text-blue-500">{row.id}</span>,
    },
    {
      name: "USER",
      selector: (row) => row.name,
      sortable: true,
      grow: 2,
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 bg-gray-100">
           {row.profile_image ? (
  <img
    src={`${import.meta.env.VITE_IMAGE_BASE_URL}/uploads/users/${row.profile_image}`}
    alt={row.name}
    className="w-full h-full object-cover"
  />
) : (
  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  </div>
)}

          </div>
          <div>
            <p className="font-semibold text-gray-800">{row.name}</p>
            {row.location && <p className="text-sm text-gray-500">{row.location}</p>}
          </div>
        </div>
      ),
    },
    {
      name: "EMAIL",
      selector: (row) => row.email,
      sortable: true,
      grow: 2,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <FiMail className="text-gray-400" />
          <span className="text-blue-600 break-words">{row.email}</span>
        </div>
      ),
    },
    {
      name: "REPORT",
      cell: (row) => (
        <button
          onClick={() => navigate(`/admin/user/${row.id}/reports`)}
          className="p-2 rounded-md hover:bg-yellow-100 transition"
          title="View Reports"
        >
          <FiFileText className="text-yellow-600" />
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "STATUS",
      selector: (row) => row.status,
      cell: (row) => {
        const isActive = row.status === 0;

        const handleToggleStatus = () => {
          const newStatus = isActive ? 1 : 0;
          setUpdatingUserId(row.id);

          dispatch(changeUserStatus({ userId: row.id, status: newStatus }))
            .unwrap()
            .then(() => dispatch(fetchUsers()))
            .catch(() => {}) // Toast handled by useEffect
            .finally(() => setUpdatingUserId(null));
        };

        return (
          <button
            onClick={handleToggleStatus}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
              isActive
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-red-100 text-red-700 hover:bg-red-200"
            }`}
            disabled={updatingUserId === row.id}
          >
            {updatingUserId === row.id
              ? "Updating..."
              : isActive
              ? "Active"
              : "Inactive"}
          </button>
        );
      },
    },
    {
      name: "ACTIONS",
      grow: 0,
      cell: (row) => (
        <button
          onClick={() => navigate(`/admin/user/${row.id}`)}
          className="p-2 rounded-md hover:bg-blue-100 transition"
          title="View User"
        >
          <FiEye size={18} className="text-blue-500" />
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        fontWeight: "600",
        fontSize: "14px",
        color: "#374151",
        backgroundColor: "#F9FAFB",
        padding: "12px",
      },
    },
    cells: {
      style: {
        fontSize: "14px",
        color: "#374151",
        padding: "12px",
      },
    },
    rows: {
      style: {
        minHeight: "60px",
        borderBottom: "1px solid #E5E7EB",
        "&:hover": {
          backgroundColor: "#F3F4F6",
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center">
        <SharezyLoader />
      </div>
    );
  }

 if (error) {
  return (
    <div className="max-w-md mx-auto mt-6 p-4 border border-red-300 bg-red-50 text-red-800 rounded-md shadow-sm">
      <p className="font-semibold text-base">⚠️ Something went wrong</p>
      <p className="mt-1 text-sm">{error}</p>
    </div>
  );
}

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
            <p className="text-gray-500">Manage all registered users and their permissions</p>
          </div>
          <div className="relative w-full md:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredUsers}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[5, 10, 15, 20]}
        highlightOnHover
        pointerOnHover
        customStyles={customStyles}
        noDataComponent={
          <div className="p-8 text-center text-gray-500">
            No users found matching your search criteria
          </div>
        }
      />
    </div>
  );
};

export default UserManagement;
