import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRidesData } from "../../redux/features/admin/totalRidesSlice";
import DataTable from "react-data-table-component";
import { FaRegCalendarAlt, FaRoute, FaUser, FaCar, FaUsers, FaInfoCircle } from "react-icons/fa";
import SharezyLoader from "../../components/SharezyLoader";
import { HiUser } from "react-icons/hi";
const TotalRides = () => {
  const dispatch = useDispatch();
  const { rides, loading, error } = useSelector((state) => state.totalRides);
  const [filteredRides, setFilteredRides] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    dispatch(fetchRidesData());
  }, [dispatch]);

  useEffect(() => {
  if (!rides) return;

  let result = [...rides];

  // Filter by status
  if (statusFilter !== "All") {
    result = result.filter((ride) => {
      if (statusFilter === "Booked") {
        return ride.booked_rides?.length > 0;
      }
      if (statusFilter === "Pending") {
        return !ride.booked_rides || ride.booked_rides.length === 0;
      }
      if (statusFilter === "Cancelled") {
        return ride.status === 2;
      }
      return true;
    });
  }

  // Filter by search term
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    result = result.filter(
      (ride) =>
        ride.source?.toLowerCase().includes(term) ||
        ride.destination?.toLowerCase().includes(term) ||
        ride.user_details?.name?.toLowerCase().includes(term) ||
        ride.vehicle_name?.toLowerCase().includes(term)
    );
  }

  // Sort by riding_date + riding_time DESC (newest to oldest)
  result.sort((a, b) => {
    const dateTimeA = new Date(
      `${a.riding_date}T${a.riding_time?.split(" ")[1] || "00:00:00"}`
    );
    const dateTimeB = new Date(
      `${b.riding_date}T${b.riding_time?.split(" ")[1] || "00:00:00"}`
    );
    return dateTimeB - dateTimeA; // Newest first
  });

  setFilteredRides(result);
}, [rides, statusFilter, searchTerm]);


  const StatusBadge = ({ status }) => {
    const statusMap = {
      0: { text: "Cancelled", bg: "bg-red-100", textColor: "text-red-800", icon: "bg-red-500" },
      1: { text: "Booked", bg: "bg-blue-100", textColor: "text-blue-800", icon: "bg-blue-500" },
    };

    const statusInfo = statusMap[status] || { text: "Unknown", bg: "bg-gray-100", textColor: "text-gray-800", icon: "bg-gray-500" };

    return (
      <div className={`inline-flex items-center ${statusInfo.bg} ${statusInfo.textColor} py-1 px-3 rounded-full text-sm font-medium`}>
        <span className={`w-2 h-2 rounded-full ${statusInfo.icon} mr-2`}></span>
        {statusInfo.text}
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const toggleRowExpanded = (row) => {
    setExpandedRow(expandedRow === row.id ? null : row.id);
  };

  const ExpandedComponent = ({ data }) => (
    <div className="p-4 bg-gray-50 border-t border-gray-200">
      <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
        <FaUsers className="text-gray-500" />
        Passenger Details ({data.booked_rides?.length || 0})
      </h3>
      
      {data.booked_rides?.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.booked_rides.map((booking) => (
            <div key={booking.id} className="bg-white p-4 rounded-lg shadow-xs border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
               {booking.booked_user_details?.profile_image ? (
  <img
    src={`${import.meta.env.VITE_IMAGE_BASE_URL}/uploads/users/${booking.booked_user_details?.profile_image}`}
    alt="Passenger"
    className="w-10 h-10 rounded-full object-cover border border-gray-200"
   
  />
) : (
  <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
    <HiUser className="text-gray-400 w-5 h-5" />
  </div>
)}
                <div>
                  <h4 className="font-medium">{booking.booked_user_details?.name || "Unknown"}</h4>
                  <p className="text-sm text-gray-500">Passenger</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Seats</p>
                  <p className="font-medium">{booking.seat}</p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <p><StatusBadge status={booking.status} /></p>
                </div>
                <div>
                  <p className="text-gray-500">Booking Date</p>
                  <p className="font-medium">{formatDate(booking.booking_date)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Price</p>
                  <p className="font-medium">₹{booking.price || "N/A"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaInfoCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">No passengers booked for this ride</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const columns = [
    {
      name: "RIDE DETAILS",
      cell: (row) => (
        <div className="py-3">
          <div className="flex items-center">
            <FaRoute className="text-gray-500 mr-2" />
            <span className="font-medium">
              {row.source} → {row.destination}
            </span>
          </div>
          <div className="flex items-center mt-1 text-sm text-gray-600">
            <FaRegCalendarAlt className="mr-2" />
            {formatDate(row.riding_date)}
          </div>
          <div className="flex items-center mt-1 text-sm text-gray-600">
            <FaCar className="mr-2" />
            {row.vehicle_name} • {row.seat} seat{row.seat !== 1 ? "s" : ""}
          </div>
        </div>
      ),
      grow: 2,
      minWidth: "200px",
      wrap: true,
    },
    {
      name: "DRIVER",
      cell: (row) => (
        <div className="flex items-center py-3">
        {row.user_details?.profile_image ? (
        <img
          src={`${import.meta.env.VITE_IMAGE_BASE_URL}/uploads/users/${row.user_details?.profile_image}`}
          alt="Driver"
          className="w-10 h-10 rounded-full object-cover mr-3 border border-gray-200"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center mr-3">
          <HiUser className="text-gray-400 text-xl" /> {/* Increased size to text-xl */}
        </div>
      )}
          <div>
            <div className="font-medium">{row.user_details?.name || "Unknown"}</div>
            <div className="text-sm text-gray-500">Driver</div>
          </div>
        </div>
      ),
      grow: 1.5,
      minWidth: "180px",
      wrap: true,
    },
    {
      name: "PASSENGERS",
      cell: (row) => (
        <div className="py-3">
          {row.booked_rides?.length > 0 ? (
            <div className="flex items-center">
              <div className="relative">
              {row.booked_rides[0].booked_user_details?.profile_image ? (
  <img
    src={`${import.meta.env.VITE_IMAGE_BASE_URL}/uploads/users/${row.booked_rides[0].booked_user_details?.profile_image}`}
    alt="Passenger"
    className="w-10 h-10 rounded-full object-cover mr-3 border border-gray-200"
    
  />
) : (
  <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center mr-3">
    <HiUser className="text-gray-400 w-5 h-5" />
  </div>
)}
                {row.booked_rides.length > 1 && (
                  <span className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    +{row.booked_rides.length - 1}
                  </span>
                )}
              </div>
              <div>
                <div className="font-medium">
                  {row.booked_rides[0].booked_user_details?.name || "Unknown"}
                </div>
                <div className="text-sm text-gray-500">
                  {row.booked_rides.length} passenger{row.booked_rides.length !== 1 ? "s" : ""}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-400">No passengers</div>
          )}
        </div>
      ),
      grow: 1.5,
      minWidth: "200px",
      wrap: true,
    },
    {
      name: "FARE",
      cell: (row) => (
        <div className="font-medium text-gray-900 py-3">₹{row.price}</div>
      ),
      minWidth: "80px",
      maxWidth: "100px",
    },
    
    {
      name: "ACTIONS",
      cell: (row) => (
        <button
          onClick={() => toggleRowExpanded(row)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium whitespace-nowrap"
        >
          {expandedRow === row.id ? "Hide Details" : "View Details"}
        </button>
      ),
      minWidth: "100px",
      maxWidth: "140px",
      wrap: true,
    },
  ];

  if (loading)
    return (
      <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center">
        <SharezyLoader />
      </div>
    );

  if (error) {
    return (
      <div className="bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-red-50 border border-red-300 text-red-800 rounded-lg shadow-md p-6 text-center">
          <h2 className="text-lg font-semibold flex items-center justify-center gap-2 mb-2">
            <span>🚫</span>
            <span>Failed to Fetch Data</span>
          </h2>
          <p className="text-sm">{error || "An unexpected error occurred. Please try again later."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 p-1.5 lg:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 sm:mb-6">
          <div className="mb-4 md:mb-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              Ride Management
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              View and manage all rides in the system
            </p>
          </div>
          <div className="w-full md:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search rides..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500">Total Rides</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                  {rides?.length || 0}
                </p>
              </div>
              <div className="p-2 sm:p-3 rounded-full bg-blue-100 text-blue-600">
                <FaCar className="text-lg sm:text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500">Booked Rides</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                  {rides?.filter(ride => ride.status === 1).length || 0}
                </p>
              </div>
              <div className="p-2 sm:p-3 rounded-full bg-green-100 text-green-600">
                <FaRegCalendarAlt className="text-lg sm:text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500">Cancelled Rides</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                  {rides?.filter(ride => ride.status === 2).length || 0}
                </p>
              </div>
              <div className="p-2 sm:p-3 rounded-full bg-red-100 text-red-600">
                <FaUser className="text-lg sm:text-xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setStatusFilter("All")}
                className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium ${
                  statusFilter === "All"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Rides
              </button>
              <button
                onClick={() => setStatusFilter("Booked")}
                className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium ${
                  statusFilter === "Booked"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Booked
              </button>
              <button
                onClick={() => setStatusFilter("Cancelled")}
                className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium ${
                  statusFilter === "Cancelled"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Cancelled
              </button>
            </div>
            <div className="text-xs sm:text-sm text-gray-500">
              Showing {filteredRides.length} ride{filteredRides.length !== 1 ? "s" : ""}
            </div>
          </div>

          <div className="overflow-x-auto">
            <DataTable
              columns={columns}
              data={filteredRides}
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[5, 10, 25]}
              highlightOnHover
              responsive
              noHeader
              expandableRows
              expandableRowsComponent={ExpandedComponent}
              expandableRowExpanded={(row) => expandedRow === row.id}
              onRowExpandToggled={(toggled, row) => toggleRowExpanded(row)}
              customStyles={{
                headCells: {
                  style: {
                    paddingLeft: "1rem",
                    paddingRight: "1rem",
                    fontWeight: "600",
                    color: "#374151",
                    backgroundColor: "#f9fafb",
                    "@media (min-width: 640px)": {
                      paddingLeft: "1.5rem",
                      paddingRight: "1.5rem",
                    },
                  },
                },
                cells: {
                  style: {
                    paddingLeft: "1rem",
                    paddingRight: "1rem",
                    "@media (min-width: 640px)": {
                      paddingLeft: "1.5rem",
                      paddingRight: "1.5rem",
                    },
                  },
                },
                rows: {
                  style: {
                    "&:not(:last-of-type)": {
                      borderBottom: "1px solid #e5e7eb",
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalRides;