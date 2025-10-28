import React, { useEffect, useState } from "react";
import {
  FiUsers,
  FiActivity,
  FiCalendar,
  FiEdit2,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { fetchRidesData } from "../../redux/features/admin/totalRidesSlice";
import { fetchUsers } from "../../redux/features/admin/userSlice";
import { fetchBookingRidesCount } from "../../redux/features/admin/bookingRidesSlice";
import { fetchAdminProfile } from "../../redux/features/admin/adminProfileSlice";
import { fetchTodayRides } from "../../redux/features/admin/todayRidesSlice";
import SharezyLoader from "../../components/SharezyLoader";
import { Link } from "react-router-dom";
import {
  commissionUpdate,
  clearCommissionState,
} from "../../redux/features/admin/commissionSlice";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { updateResponse } = useSelector((state) => state.commission);

  const { users, status: usersStatus } = useSelector((state) => state.users);
  const { rides, status: ridesStatus } = useSelector((state) => state.totalRides);
  const { count, status: bookingStatus } = useSelector((state) => state.bookingRides);
  const { profile, status: profileStatus } = useSelector((state) => state.adminProfile);
  const { rides: todaybooking, status: todayRidesStatus } = useSelector((state) => state.todayRides);

  const [isEditingCommission, setIsEditingCommission] = useState(false);
  const [commissionValue, setCommissionValue] = useState(profile?.commission ?? 0);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchRidesData());
    dispatch(fetchBookingRidesCount());
    dispatch(fetchAdminProfile());
    dispatch(fetchTodayRides());
  }, [dispatch]);

  useEffect(() => {
    setCommissionValue(profile?.commission ?? 0);
  }, [profile]);

  const handleCommissionSubmit = () => {
    const commission = parseFloat(commissionValue);
    if (isNaN(commission)) {
      alert("Enter a valid number.");
      return;
    }
    dispatch(commissionUpdate({ commission }));
    setIsEditingCommission(false);
  };

  const isLoading =
    usersStatus === "loading" ||
    ridesStatus === "loading" ||
    bookingStatus === "loading" ||
    profileStatus === "loading" ||
    todayRidesStatus === "loading";

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center">
        <SharezyLoader />
      </div>
    );
  }

  const todayDate = new Date().toISOString().split("T")[0];

 // Filter rides by date AND status === 1
const todaysRides = rides.filter(
  (ride) => ride.riding_date === todayDate && ride.status === 1
);

const todaysRidesWithName = todaysRides.map((ride) => ({
  ...ride,
  user_name: ride.user_details?.name || "N/A",
}));

// Flatten bookings, then filter by date AND status === 1
const todaysBookings = todaybooking
  .flatMap((ride) =>
    (ride.booked_rides || [])
      .filter((booking) => booking.status === 1) // Only status 1 bookings
      .map((booking) => ({
        ...booking,
        ride_id: ride.id,
        source: ride.source,
        destination: ride.destination,
      }))
  )
  .filter((booking) => booking.booking_date === todayDate);


  return (
    <div className="bg-gray-50 min-h-screen py-2">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Rides */}
        <StatCard title="Total Rides" value={rides.length} icon={<FiActivity className="text-blue-500" />} />
        {/* Users */}
        <StatCard title="Active Users" value={users.length} icon={<FiUsers className="text-green-500" />} />
        {/* Editable Commission */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Commission %</p>
              {isEditingCommission ? (
                <div className="flex items-center space-x-2 mt-1">
                  <input
                    type="number"
                    value={commissionValue}
                    onChange={(e) => setCommissionValue(e.target.value)}
                    className="border px-2 py-1 w-16 text-gray-700 text-sm rounded"
                  />
                  <button onClick={handleCommissionSubmit} className="text-green-600">
                    <FiCheck />
                  </button>
                  <button onClick={() => setIsEditingCommission(false)} className="text-red-500">
                    <FiX />
                  </button>
                </div>
              ) : (
                <p className="text-2xl font-bold text-gray-800 mt-1 flex items-center space-x-2">
                  {commissionValue}
                  <FiEdit2
                    className="text-gray-400 ml-2 cursor-pointer hover:text-gray-700"
                    onClick={() => setIsEditingCommission(true)}
                  />
                </p>
              )}
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-purple-500 text-xl font-semibold">%</span>
            </div>
          </div>
        </div>
        {/* New Bookings */}
        <StatCard title="New Bookings" value={count} icon={<FiCalendar className="text-orange-500" />} />
      </div>

      {/* Today's Rides and Bookings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RideTable rides={todaysRidesWithName} />
        <BookingTable bookings={todaysBookings} />
      </div>
    </div>
  );
};

// 📦 Reusable Stat Card
const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
      <div className="p-3 bg-gray-50 rounded-lg">{icon}</div>
    </div>
  </div>
);

// 📦 Today's Rides Table
const RideTable = ({ rides }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <h2 className="text-lg font-bold text-gray-800 mb-4">Today's Rides</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <TableHeader titles={["Ride ID", "Name", "Source", "Destination", "Date", "Seats", "₹/Seat"]} />
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rides.length > 0 ? (
            rides.map((ride) => (
              <tr key={ride.id}>
                <td className="px-4 py-2 text-sm text-gray-900">{ride.id}</td>
                <td className="px-4 py-2 text-sm text-blue-700">
                  <Link to={`/admin/user/${ride.user_id}`}>{ride.user_name}</Link>
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">{ride.source}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{ride.destination}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{ride.riding_date}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{ride.seat}</td>
                <td className="px-4 py-2 text-sm text-gray-600">₹{ride.price}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="px-4 py-4 text-center text-sm text-gray-500">
                No rides today.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

// 📦 Today's Bookings Table
const BookingTable = ({ bookings }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <h2 className="text-lg font-bold text-gray-800 mb-4">Today's Bookings</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <TableHeader titles={["Booking ID", "Name", "Ride ID", "Seats", "Booking Date", "Price"]} />
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="px-4 py-2 text-sm text-gray-900">{booking.id}</td>
                <td className="px-4 py-2 text-sm text-blue-600">
                  <Link to={`/admin/user/${booking.booked_user_details?.id}`}>
                    {booking.booked_user_details?.name || "N/A"}
                  </Link>
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">{booking.ride_id}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{booking.seat}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{booking.booking_date}</td>
                <td className="px-4 py-2 text-sm text-gray-600">₹{booking.price}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-4 py-4 text-center text-sm text-gray-500">
                No bookings today.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

// 📦 Reusable Table Header
const TableHeader = ({ titles }) =>
  titles.map((title) => (
    <th
      key={title}
      className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
    >
      {title}
    </th>
  ));

export default AdminDashboard;
