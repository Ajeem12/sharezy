import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import { fetchAllRideDisputes, getRideDisputes, getStatus, getError } from '../../redux/features/admin/supportSlice';
import { FaExclamationTriangle, FaCheckCircle, FaUser, FaCar, FaMapMarkerAlt, FaCalendarAlt, FaClock } from 'react-icons/fa';
import SharezyLoader from "../../components/SharezyLoader";

const UserReport = () => {
  const dispatch = useDispatch();
  const rideDisputes = useSelector(getRideDisputes);
  const status = useSelector(getStatus);
  const error = useSelector(getError);

  useEffect(() => {
    dispatch(fetchAllRideDisputes());
  }, [dispatch]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
  if (!timeString) return 'N/A';
  
  // Extract only HH:MM:SS part even if it's a full datetime
  const timePart = timeString.includes(' ') ? timeString.split(' ')[1] : timeString;
  
  const date = new Date(`1970-01-01T${timePart}`);
  
  // If date is invalid, fallback to raw
  if (isNaN(date)) return timePart;

  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });
};
;

  


  const columns = [
    {
      name: 'Report Details',
      cell: (row) => (
        <div className="py-3">
          <div className="font-medium text-gray-800">{row.remark || 'No remark provided'}</div>
          <div className="text-sm text-gray-500 mt-1">
            Reported on: {formatDate(row.created_at)}
          </div>
        </div>
      ),
      grow: 2,
      minWidth: '200px'
    },
    {
      name: 'Reported By',
      cell: (row) => (
        <div className="flex items-center py-3">
          <div className="bg-blue-100 p-2 rounded-full mr-3">
            <FaUser className="text-blue-600" />
          </div>
          <div>
            <div className="font-medium">{row.reported_by_details?.name || 'Unknown'}</div>
            <div className="text-sm text-gray-500">
              {row.reported_by_details?.mobile || 'No contact'}
            </div>
          </div>
        </div>
      ),
      grow: 1.5,
      minWidth: '180px'
    },
    {
      name: 'Reported To',
      cell: (row) => (
        <div className="py-3">
          <div className="flex items-center">
            <div className="bg-red-100 p-2 rounded-full mr-3">
              <FaUser className="text-red-600" />
            </div>
            <div className="font-medium text-gray-800">{row.blocked_user_details?.name || 'Unknown'}</div>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {row.blocked_user_details?.email || 'No email'}
          </div>
        </div>
      ),
      grow: 1.5,
      minWidth: '180px'
    },
    {
      name: 'Ride Info',
      cell: (row) => (
        <div className="py-3">
          <div className="flex items-center text-gray-800">
            <FaMapMarkerAlt className="text-blue-500 mr-2 text-sm" />
            <span className="truncate">
              {row.my_ride_details?.source || 'N/A'} → {row.my_ride_details?.destination || 'N/A'}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <FaCar className="mr-2 text-sm" />
            <span className="truncate">
              {row.my_ride_details?.vehicle_name || 'N/A'} ({row.my_ride_details?.vehicle_no || 'N/A'})
            </span>
          </div>
        </div>
      ),
      grow: 2,
      minWidth: '220px'
    },
  ];

  const ExpandedComponent = ({ data }) => (
    <div className="p-4 bg-gray-50 border-t border-gray-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reporter Details */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3 flex items-center">
            <div className="bg-blue-100 p-2 rounded-full mr-2">
              <FaUser className="text-blue-600 text-sm" />
            </div>
            Reporter Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Name</p>
              <p className="font-medium">{data.reported_by_details?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium">{data.reported_by_details?.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500">Mobile</p>
              <p className="font-medium">{data.reported_by_details?.mobile || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500">Location</p>
              <p className="font-medium">{data.reported_by_details?.location || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500">Report Date</p>
              <p className="font-medium">{formatDate(data.created_at)}</p>
            </div>
          </div>
        </div>

        {/* Reported To Details */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3 flex items-center">
            <div className="bg-red-100 p-2 rounded-full mr-2">
              <FaUser className="text-red-600 text-sm" />
            </div>
            Reported To 
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Name</p>
              <p className="font-medium">{data.blocked_user_details?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium">{data.blocked_user_details?.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500">Mobile</p>
              <p className="font-medium">{data.blocked_user_details?.mobile || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500">Location</p>
              <p className="font-medium">{data.blocked_user_details?.location || 'N/A'}</p>
            </div>
            {/* <div>
              <p className="text-gray-500">Status</p>
              <p className="font-medium">
                {data.blocked_user_details?.status === 0 ? (
                  <span className="text-red-600">Blocked</span>
                ) : (
                  <span className="text-green-600">Active</span>
                )}
              </p>
            </div> */}
          </div>
        </div>
      </div>

      {/* Ride Details */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h3 className="font-medium text-gray-900 mb-3 flex items-center">
          <div className="bg-green-100 p-2 rounded-full mr-2">
            <FaCar className="text-green-600 text-sm" />
          </div>
          Ride Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Route</p>
            <p className="font-medium">
              {data.my_ride_details?.source || 'N/A'} → {data.my_ride_details?.destination || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Date</p>
            <p className="font-medium">
              {formatDate(data.my_ride_details?.riding_date)}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Time</p>
            <p className="font-medium">
              {formatTime(data.my_ride_details?.riding_time)}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Vehicle</p>
            <p className="font-medium">
              {data.my_ride_details?.vehicle_name || 'N/A'} ({data.my_ride_details?.vehicle_no || 'N/A'})
            </p>
          </div>
          <div>
            <p className="text-gray-500">Seats</p>
            <p className="font-medium">
              {data.my_ride_details?.seat || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Price</p>
            <p className="font-medium">
              {data.my_ride_details?.price ? `₹${data.my_ride_details.price}` : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Report Details */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h3 className="font-medium text-gray-900 mb-3">Report Details</h3>
        <div>
          <p className="text-gray-500 mb-1">Remark</p>
          <p className="font-medium">
            {data.remark || 'No remark provided'}
          </p>
        </div>
      </div>
    </div>
  );

  if (status === 'loading') {
    return (
      <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center">
        <SharezyLoader />
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 my-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <FaExclamationTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Error loading disputes: {error || 'Unknown error occurred'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Ride Disputes</h2>
            <p className="mt-1 text-sm text-gray-500">
              View and manage all reported ride disputes
            </p>
          </div>
          
          <div className="p-4 sm:p-6">
            {rideDisputes.length > 0 ? (
              <DataTable
                columns={columns}
                data={[...rideDisputes].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))}
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[5, 10, 25]}
                highlightOnHover
                responsive
                expandableRows
                expandableRowsComponent={ExpandedComponent}
                noDataComponent={
                  <div className="py-8 text-center text-gray-500">
                    No dispute records found
                  </div>
                }
                customStyles={{
                  headCells: {
                    style: {
                      paddingLeft: '16px',
                      paddingRight: '16px',
                      fontWeight: '600',
                      color: '#374151',
                      backgroundColor: '#f9fafb',
                      fontSize: '14px',
                    },
                  },
                  cells: {
                    style: {
                      paddingLeft: '16px',
                      paddingRight: '16px',
                      fontSize: '14px',
                    },
                  },
                  rows: {
                    style: {
                      '&:not(:last-of-type)': {
                        borderBottom: '1px solid #e5e7eb',
                      },
                    },
                  },
                }}
              />
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FaExclamationTriangle className="text-gray-400 text-3xl" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-1">No disputes found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  When users report ride issues, they'll appear here with all the details.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserReport;