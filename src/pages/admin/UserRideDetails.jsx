import React, { useState, useEffect } from "react";
import {
  FiUser,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiDollarSign,
  FiUsers,
  FiChevronRight,
  FiPhone,
  FiMail,
  FiHome,
  FiStar,
} from "react-icons/fi";
import { HiUser } from "react-icons/hi";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserWisePublishRides } from "../../redux/features/admin/userWisePublishRidesSlice";
import SharezyLoader from "../../components/SharezyLoader";
import { Link } from "react-router-dom";
import {
  getKycById,
  fetchAdmins,
  clearCurrentKyc,
} from "../../redux/features/admin/adminKycListSlice";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("booked");
  const { userId } = useParams();
  const dispatch = useDispatch();
  const [remark, setRemark] = useState("");

  const {
    publishedRides = [],
    loading,
    error,
  } = useSelector((state) => state.userWisePublishRides);
  const {
    currentKyc,
    loading: kycLoading,
    error: kycError,
  } = useSelector((state) => state.admin);
  const kycData = currentKyc?.data ?? currentKyc;

  const { admins } = useSelector((state) => state.admin);

  // Extract user info safely from first ride if exists
  const userInfo =
    publishedRides.length > 0 ? publishedRides[0].user_details : {};
  const matchedKyc = admins?.data?.find(
    (k) => k.login_user_id === Number(userId)
  );

  // Calculate totals
  const totalPublished = publishedRides.length;

  // Total Booked (excluding cancelled bookings where status === 0)
  const totalBooked = publishedRides.reduce((acc, ride) => {
    const validBookings = (ride.booked_rides || []).filter(
      (booking) => booking.status !== 0
    );
    return acc + validBookings.length;
  }, 0);

  // Total Transactions (same logic)
  const totalTransactions = publishedRides.reduce((acc, ride) => {
    const validBookings = (ride.booked_rides || []).filter(
      (booking) => booking.status !== 0
    );
    return acc + validBookings.length;
  }, 0);

  // Total Earnings (only non-cancelled bookings count toward price)
  const totalEarnings = publishedRides.reduce((sum, ride) => {
    const validBookings = (ride.booked_rides || []).filter(
      (booking) => booking.status !== 0
    );
    return (
      sum +
      validBookings.reduce((rideSum, booking) => {
        return rideSum + (booking.price || 0);
      }, 0)
    );
  }, 0);
  publishedRides.forEach((ride) => {
    console.log("Ride ID:", ride.id);
    console.log(
      "Valid bookings:",
      (ride.booked_rides || []).filter((booking) => booking.status !== 0)
    );
    console.log(
      "Canceled bookings:",
      (ride.booked_rides || []).filter((booking) => booking.status === 0)
    );
  });

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserWisePublishRides(userId));
      dispatch(fetchAdmins()); // load all KYCs once
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (matchedKyc?.id) {
      dispatch(getKycById(matchedKyc.id));
    } else {
      dispatch(clearCurrentKyc()); //clear the stale Kyc
    }
  }, [dispatch, matchedKyc]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = { weekday: "short", day: "numeric", month: "short" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  const formatTime = (timeString) => {
    if (!timeString) return "-";
    return new Date(timeString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return "Available";
      case 2:
        return "Upcoming";
      case 3:
        return "Completed";
      default:
        return "Unknown";
    }
  };
  console.log("KYC DATA:", kycData);
  console.log("user id:", userId);

  const getStatusClass = (status) => {
    switch (status) {
      case 1:
        return "bg-green-100 text-green-800";
      case 2:
        return "bg-blue-100 text-blue-800";
      case 3:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  //
  //   const kycData = {
  //   aadhar_no: "1234 1234 338749",
  //   upload_aadhar: "202507160902181752656538.jpg",
  //   pancard_no: "ABCDE1234F",
  //   upload_pancard: "202507160902181752656538.jpg",
  //   bank_acc_no: "4556464",
  //   bank_acc_name: "gfgfgfgfgfddxsres",
  //   ifsc_code: "12134121",
  //   upload_photo: "202507160902181752656538.jpg",
  // };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center">
        <SharezyLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md">
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Error loading data
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => dispatch(fetchUserWisePublishRides(userId))}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* User Profile Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-6 md:items-center">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="relative">
                {userInfo?.profile_image ? (
                  <img
                    src={`${BASE_URL}/uploads/users/${userInfo.profile_image}`}
                    alt="Profile"
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-md"
                    onError={(e) => {
                      e.target.onerror = null; // Prevent infinite loop
                      e.target.src = ""; // Clear broken image
                    }}
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-100 border-4 border-white shadow-md flex items-center justify-center">
                    <HiUser className="text-gray-400 w-10 h-10" />
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-1 shadow-md">
                  <FiStar className="text-white w-5 h-5" />
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    {userInfo.name || "User Name"}
                  </h1>
                  <p className="text-gray-600 flex items-center mt-1">
                    <FiMail className="mr-2" />
                    {userInfo.email || "Email not provided"}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {userInfo.role === 1 ? "User" : "Driver"}
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Member Since
                  </p>
                  <p className="font-medium text-gray-800">
                    {formatDate(userInfo.created_at)}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Phone
                  </p>
                  <p className="font-medium text-gray-800 flex items-center">
                    <FiPhone className="mr-1" />
                    {userInfo.mobile || "-"}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Location
                  </p>
                  <p className="font-medium text-gray-800 flex items-center">
                    <FiHome className="mr-1" />
                    {userInfo.location || "-"}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Total Rides
                  </p>
                  <p className="font-medium text-gray-800">
                    {totalBooked + totalPublished}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*  */}
      {/* ================= KYC SECTION ================= */}
      {kycLoading ? (
        <div className="max-w-6xl mx-auto bg-white rounded-xl p-10 mt-10 text-center">
          <p className="text-gray-600">Loading KYC details…</p>
        </div>
      ) : kycError ? (
        <div className="max-w-6xl mx-auto bg-white rounded-xl p-10 mt-10 text-center text-red-600">
          Failed to load KYC details
        </div>
      ) : !kycData ? (
        <div className="max-w-6xl mx-auto bg-white rounded-xl p-10 mt-10 text-center text-gray-500">
          User has not submitted KYC yet
        </div>
      ) : (
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-10 ring-1 ring-blue-200">
          <div className="flex justify-between items-start mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 border-b pb-4 border-blue-100">
              KYC Details
            </h2>

            {/* Circular Photo */}
            <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-blue-300">
              <img
                // src={`/uploads/${kycData.upload_photo}`}
                src={`${BASE_URL}/uploads/upload_photo/${kycData.upload_photo}`}
                alt="Photo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Aadhar Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Aadhar Number
                  </label>
                  <div className="mt-1 p-2 bg-blue-50 rounded-md ring-1 ring-blue-200">
                    {kycData.aadhar_no}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Uploaded Aadhar
                  </label>
                  <img
                    // src={`/uploads/${kycData.upload_aadhar}`}
                    src={`${BASE_URL}/uploads/aadhar/${kycData.upload_aadhar}`}
                    alt="Aadhar"
                    className="mt-2 w-full max-w-xs rounded-md ring-1 ring-blue-200"
                  />
                </div>
              </div>

              {/* PAN Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    PAN Card Number
                  </label>
                  <div className="mt-1 p-2 bg-blue-50 rounded-md ring-1 ring-blue-200">
                    {kycData.pancard_no}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Uploaded PAN Card
                  </label>
                  <img
                    // src={`/uploads/${kycData.upload_pancard}`}
                    src={`${BASE_URL}/uploads/pancard//${kycData.upload_pancard}`}
                    alt="PAN"
                    className="mt-2 w-full max-w-xs rounded-md ring-1 ring-blue-200"
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Bank Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Bank Account Number
                  </label>
                  <div className="mt-1 p-2 bg-blue-50 rounded-md ring-1 ring-blue-200">
                    {kycData.bank_acc_no}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Account Holder Name
                  </label>
                  <div className="mt-1 p-2 bg-blue-50 rounded-md ring-1 ring-blue-200">
                    {kycData.bank_acc_name}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    IFSC Code
                  </label>
                  <div className="mt-1 p-2 bg-blue-50 rounded-md ring-1 ring-blue-200">
                    {kycData.ifsc_code}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Remark and Actions */}
          <div className="mt-8 pt-6 border-t border-blue-100">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">
                Remark
              </label>
              <textarea
                rows="3"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Write your remark..."
                className="mt-1 block w-full bg-blue-50 rounded-md ring-1 ring-blue-200 focus:ring-2 focus:ring-blue-500 p-3"
              />
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                kycData.status === 1
                  ? "bg-green-100 text-green-700"
                  : kycData.status === 2
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {kycData.status === 1
                ? "Approved"
                : kycData.status === 2
                ? "Rejected"
                : "Pending"}
            </span>

            <div className="flex gap-4 justify-end">
              {/* <button className="px-6 py-2 rounded-md ring-1 ring-red-300 text-red-700 bg-white hover:bg-red-50 transition-colors">
        Cancel
      </button> */}
              <button className="px-6 py-2 rounded-md ring-1 ring-blue-300 text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                Confirm
              </button>
              <button className="px-6 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors">
                Cancel with Remark
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ================= END KYC SECTION ================= */}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="flex overflow-x-auto scrollbar-hide mb-6">
          <button
            onClick={() => setActiveTab("booked")}
            className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${
              activeTab === "booked"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Booked Rides ({totalBooked})
          </button>
          <button
            onClick={() => setActiveTab("published")}
            className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${
              activeTab === "published"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Published Rides ({totalPublished})
          </button>
          <button
            onClick={() => setActiveTab("transactions")}
            className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${
              activeTab === "transactions"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Transactions ({totalTransactions})
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Booked Rides Tab */}
          {activeTab === "booked" && (
            <>
              {publishedRides.some((ride) => ride.booked_rides?.length > 0) ? (
                publishedRides.map((ride) =>
                  ride.booked_rides?.length > 0 ? (
                    <div
                      key={ride.id}
                      className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
                    >
                      {/* Ride Header */}
                      <div className="p-5 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                              <FiMapPin className="text-blue-500 mr-2" />
                              {ride.source} → {ride.destination}
                            </h3>
                            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                              <span className="flex items-center">
                                <FiCalendar className="mr-1.5" />
                                {formatDate(ride.riding_date)}
                              </span>
                              <span className="flex items-center">
                                <FiClock className="mr-1.5" />
                                {formatTime(ride.riding_time)}
                              </span>
                              <span className="flex items-center">
                                ₹{ride.price}
                              </span>
                              <span className="flex items-center">
                                <FiUsers className="mr-1.5" />
                                {ride.booked_rides.length} Booking
                                {ride.booked_rides.length !== 1 ? "s" : ""}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bookings Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
                        {ride.booked_rides.map((booking) => {
                          const user = booking.booked_user_details;
                          if (!user) return null;
                          const isCancelled = booking.status === 0;
                          return (
                            <div
                              key={booking.id}
                              className="flex items-start p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition"
                            >
                              <div className="flex-shrink-0 mr-4">
                                {user.profile_image ? (
                                  <img
                                    src={`${BASE_URL}/uploads/users/${user.profile_image}`}
                                    alt={user.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                    onError={(e) => {
                                      e.target.src = `${BASE_URL}/uploads/users/default-user.png`;
                                    }}
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                                    {user.name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <Link
                                  to={`/admin/user/${user.id}`}
                                  className="text-blue-600 hover:text-blue-800 font-medium truncate block"
                                >
                                  {user.name}
                                </Link>
                                <p className="text-sm text-gray-500 truncate">
                                  {user.email}
                                </p>
                                <p className="text-sm text-gray-500 flex items-center mt-1">
                                  <FiPhone className="mr-1.5" size={14} />
                                  {user.mobile || "Not provided"}
                                </p>
                                <div className="mt-2">
                                  <span
                                    className={`inline-block text-xs font-semibold px-2 py-1 rounded ${
                                      isCancelled
                                        ? "bg-red-100 text-red-700"
                                        : "bg-green-100 text-green-700"
                                    }`}
                                  >
                                    {isCancelled ? "Cancelled" : "Booked"}
                                  </span>
                                </div>
                              </div>
                              <div className="flex-shrink-0 ml-4 text-right">
                                <span className="block text-sm font-medium text-gray-800">
                                  {booking.seat} seat
                                  {booking.seat !== "1" ? "s" : ""}
                                </span>
                                <span className="block text-sm text-gray-500 mt-1">
                                  ₹
                                  {booking.price ||
                                    ride.price * Number(booking.seat)}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : null
                )
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <div className="mx-auto max-w-md">
                    <FiUsers className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                      No booked rides
                    </h3>
                    <p className="mt-1 text-gray-500">
                      This user hasn't booked any rides yet.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Published Rides Tab */}
          {activeTab === "published" && (
            <>
              {publishedRides.length > 0 ? (
                <div className="space-y-4">
                  {publishedRides.map((ride) => (
                    <div
                      key={ride.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
                    >
                      <div className="p-5">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start">
                              <div className="bg-blue-100 p-2 rounded-lg mr-4">
                                <FiMapPin className="text-blue-600" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-800">
                                  {ride.source} → {ride.destination}
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
                                  <div className="flex items-center text-gray-600">
                                    <FiCalendar className="mr-2 text-gray-400" />
                                    <span>{formatDate(ride.riding_date)}</span>
                                  </div>
                                  <div className="flex items-center text-gray-600">
                                    <FiClock className="mr-2 text-gray-400" />
                                    <span>{formatTime(ride.riding_time)}</span>
                                  </div>
                                  <div className="flex items-center text-gray-600">
                                    <span>₹{ride.price}</span>
                                  </div>
                                  <div className="flex items-center text-gray-600">
                                    <FiUsers className="mr-2 text-gray-400" />
                                    <span>
                                      {ride.seat} seat
                                      {ride.seat !== "1" ? "s" : ""}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <div className="mx-auto max-w-md">
                    <FiMapPin className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                      No published rides
                    </h3>
                    <p className="mt-1 text-gray-500">
                      This user hasn't published any rides yet.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Transactions Tab */}
          {activeTab === "transactions" && (
            <>
              {publishedRides.some(
                (ride) =>
                  ride.booked_rides?.some((booking) => booking.status !== 0) // at least one booking with status !== 0
              ) ? (
                <div className="space-y-4">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          Total Earnings
                        </h3>
                        <p className="text-gray-500">
                          From all completed rides
                        </p>
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        ₹{totalEarnings.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {publishedRides.map((ride) =>
                    ride.booked_rides
                      ?.filter((booking) => booking.status !== 0) // filter here
                      .map((booking) => (
                        <div
                          key={booking.id}
                          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
                        >
                          <div className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                              <h3 className="font-semibold text-gray-800">
                                {ride.source} → {ride.destination}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {formatDate(ride.riding_date)} • {booking.seat}{" "}
                                seat{booking.seat !== "1" ? "s" : ""}
                              </p>
                            </div>
                            <div className="flex items-center space-x-6">
                              <div className="text-right">
                                <p className="text-lg font-bold text-gray-800">
                                  ₹
                                  {booking.price ||
                                    ride.price * Number(booking.seat)}
                                </p>
                                <p className="text-xs text-gray-500"></p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <div className="mx-auto max-w-md">
                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                      No transactions
                    </h3>
                    <p className="mt-1 text-gray-500">
                      This user hasn't completed any transactions yet.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
