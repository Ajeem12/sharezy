import React, { useState, useEffect } from "react";
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUsers,
  FiDollarSign,
  FiChevronDown,
  FiChevronUp,
  FiCheckCircle,
  FiXCircle,
  FiUser,
  FiPhone,
  FiNavigation,
} from "react-icons/fi";
import { TbPasswordMobilePhone } from "react-icons/tb";
import { FaCar } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBookings,
  cancelBooking,
} from "../../redux/features/profile/bookingSlice";
import {
  submitReport,
  resetReportState,
} from "../../redux/features/reportSlice";
import SharezyLoader from "../../components/SharezyLoader";

const MyBookings = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [report, setReport] = useState("");
  const [reportBookingId, setReportBookingId] = useState(null);

  const dispatch = useDispatch();
  const { bookings, status, error } = useSelector((state) => state.booking);

  const {
    loading: reportLoading,
    success: reportSuccess,
    error: reportError,
  } = useSelector((state) => state.report);

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  const handleCancelClick = (bookingId) => {
    setBookingToCancel(bookingId);
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    if (cancelReason.trim() && bookingToCancel) {
      dispatch(
        cancelBooking({
          bookingId: bookingToCancel,
          reason: cancelReason,
          status: 0, // 0 for cancelled
        })
      ).then(() => {
        setShowCancelModal(false);
        setCancelReason("");
        setBookingToCancel(null);
        dispatch(fetchBookings());
      });
    }
  };

  const handleReportSubmit = () => {
    if (report.trim() && reportBookingId) {
      dispatch(submitReport({ report, bookingId: reportBookingId })).then(
        () => {
          setReport("");
          setTimeout(() => {
            dispatch(resetReportState());
          }, 3000);
        }
      );
    }
  };

  const toggleBooking = (id) => {
    if (expandedBooking === id) {
      setExpandedBooking(null);
      setReportBookingId(null);
    } else {
      setExpandedBooking(id);
      setReportBookingId(id);
    }
  };

  const formatDate = (dateString) => {
    const options = {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const sortedBookings = [...(bookings || [])].sort((a, b) => b.id - a.id);

  const filteredBookings =
    sortedBookings.filter((booking) =>
      activeTab === "all"
        ? booking.booking_status === 1
        : booking.booking_status === 2
    ) || [];

  console.log("filteredBookings", filteredBookings);

  // Before return

  const activeBookings = sortedBookings.filter((b) => b.booking_status === 1);

  const cancelledBookings = sortedBookings.filter(
    (b) => b.booking_status === 2
  );

  if (status === "loading") {
    return <SharezyLoader />;
  }

  if (status === "failed") {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-1.5 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <FiXCircle className="h-5 w-5 text-red-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Failed to load bookings: {error}
            </p>
          </div>
        </div>
      </div>
    );
  }
  const isBookingCancellable = (ridingDate, ridingTime) => {
    const timePart = ridingTime.split(" ")[1]; // Extract just the HH:mm:ss from ridingTime
    const rideDateTime = new Date(`${ridingDate}T${timePart}`);
    const now = new Date();
    const timeDifference = rideDateTime - now;

    return timeDifference > 2 * 60 * 60 * 1000; // More than 2 hours
  };

  return (
    <div className="max-w-6xl mx-auto p-1.5  lg:p-8 mb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            My Ride Bookings
          </h1>
          <p className="text-gray-500 mt-1">
            {activeTab === "all"
              ? "All your active bookings"
              : "Cancelled bookings"}
          </p>
        </div>
      </div>

      {/* Tabs */}
      {/* <div className="flex overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {["all", "cancelled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 font-medium text-sm whitespace-nowrap mr-2 rounded-lg ${
              activeTab === tab
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab === "all" ? "All Rides" : "Cancelled"} (
            {filteredBookings.length})
          </button>
        ))}
      </div> */}

      <div className="flex overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {["all", "cancelled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 font-medium text-sm whitespace-nowrap mr-2 rounded-lg ${
              activeTab === tab
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab === "all"
              ? `All Rides (${activeBookings.length})`
              : `Cancelled (${cancelledBookings.length})`}
          </button>
        ))}
      </div>

      {/* Booking Cards */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 rounded-xl bg-gray-50 border border-gray-200">
          <div className="mx-auto w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-5">
            <FiMapPin className="text-blue-400 text-3xl" />
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">
            {activeTab === "all"
              ? "No active bookings"
              : "No cancelled bookings"}
          </h3>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredBookings.map((booking) => {
              const ride = booking.my_ride_details;
              const driver = ride?.user_details;
              const isExpanded = expandedBooking === booking.id;
              const isCancelled = booking.booking_status === 2;

              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                >
                  <div
                    className="p-5 cursor-pointer"
                    onClick={() => toggleBooking(booking.id)}
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div
                            className={`p-2.5 rounded-lg ${
                              isCancelled
                                ? "bg-gray-100 text-gray-600"
                                : "bg-green-100 text-green-600"
                            }`}
                          >
                            {isCancelled ? (
                              <FiXCircle className="text-gray-500" />
                            ) : (
                              <FiCheckCircle className="text-green-500" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center flex-wrap gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {ride.source} → {ride.destination}
                              </h3>
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  isCancelled
                                    ? "bg-gray-100 text-gray-600"
                                    : "bg-green-100 text-green-600"
                                }`}
                              >
                                {isCancelled ? "Cancelled" : "Active"}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 flex items-center gap-1.5">
                              <FiCalendar className="text-gray-400" />
                              {formatDate(ride.riding_date)} at{" "}
                              {formatTime(ride.riding_time)}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-gray-700">
                          <div className="flex items-center gap-2 text-sm">
                            <FiUsers className="text-gray-400 flex-shrink-0" />
                            <span>
                              {booking.seat} seat
                              {booking.seat !== "1" ? "s" : ""}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span>₹{booking.price}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <FaCar className="text-gray-400 flex-shrink-0" />
                            <span>{ride.vehicle_name || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <FiNavigation className="text-gray-400 flex-shrink-0" />
                            <span>{ride.vehicle_no || "N/A"}</span>
                          </div>

                          {booking.otp && (
                            <div className="flex items-center gap-2 text-sm">
                              <TbPasswordMobilePhone className="text-gray-400 flex-shrink-0" />
                              OTP:
                              <span className="bg-blue-100 px-1 py-1 rounded">
                                {booking.otp || "N/A"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-between">
                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900">
                            ₹{booking.price}
                          </div>
                          <div className="text-xs text-gray-500">
                            Total Amount
                          </div>
                        </div>
                        <button
                          className={`p-1.5 rounded-full ${
                            isExpanded
                              ? "bg-gray-100 text-gray-600"
                              : "text-gray-400 hover:bg-gray-50"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBooking(booking.id);
                          }}
                        >
                          {isExpanded ? (
                            <FiChevronUp size={18} />
                          ) : (
                            <FiChevronDown size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 border-t border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            {/* Driver Details */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                <FiUser className="text-gray-500" />
                                Driver Information
                              </h4>
                              <div className="space-y-3 text-gray-700">
                                <div className="flex items-center gap-2">
                                  <span className="w-24 text-gray-500">
                                    Name:
                                  </span>
                                  <span>{driver?.name || "Not available"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="w-24 text-gray-500">
                                    Contact:
                                  </span>
                                  <span>{driver?.mobile || "Not shared"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="w-24 text-gray-500">
                                    Vehicle:
                                  </span>
                                  <span>
                                    {ride.vehicle_name} ({ride.vehicle_no})
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Ride Details */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                <FiMapPin className="text-gray-500" />
                                Ride Information
                              </h4>
                              <div className="space-y-3 text-gray-700">
                                <div className="flex items-start gap-2">
                                  <span className="w-24 text-gray-500">
                                    Pickup:
                                  </span>
                                  <span>{ride.source}</span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <span className="w-24 text-gray-500">
                                    Dropoff:
                                  </span>
                                  <span>{ride.destination}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="w-24 text-gray-500">
                                    Date:
                                  </span>
                                  <span>{formatDate(ride.riding_date)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="w-24 text-gray-500">
                                    Time:
                                  </span>
                                  <span>{formatTime(ride.riding_time)}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="mt-6 pt-4 border-t border-gray-200">
                            <div className="flex flex-wrap gap-3 justify-end">
                              {!isCancelled ? (
                                isBookingCancellable(
                                  ride.riding_date,
                                  ride.riding_time
                                ) ? (
                                  <>
                                    <button
                                      onClick={() =>
                                        handleCancelClick(booking.id)
                                      }
                                      className="px-4 py-2 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium"
                                    >
                                      Cancel Booking
                                    </button>
                                    {/* <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                                      Contact Driver
                                    </button> */}
                                  </>
                                ) : (
                                  <div className="w-full bg-yellow-50 p-3 rounded-lg text-yellow-800 text-sm font-medium">
                                    Cancellation is not allowed within 2 hours
                                    of the ride.
                                  </div>
                                )
                              ) : (
                                <div className="w-full bg-gray-100 p-3 rounded-lg">
                                  <p className="text-sm font-medium text-gray-700">
                                    Cancellation Reason:
                                  </p>
                                  <p className="text-gray-600 mt-1">
                                    {booking.cancel_reason ||
                                      "No reason provided"}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Report Section - Available for all booking statuses */}
                            <div className="mt-6">
                              <label
                                htmlFor="report"
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                Report an Issue (optional)
                              </label>
                              <textarea
                                id="report"
                                rows={3}
                                className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                                placeholder="Describe your issue here..."
                                value={report}
                                onChange={(e) => setReport(e.target.value)}
                              />
                              <button
                                onClick={handleReportSubmit}
                                disabled={!report.trim() || reportLoading}
                                className={`mt-2 px-4 py-2 rounded-lg text-white text-sm font-medium ${
                                  report.trim() && !reportLoading
                                    ? "bg-red-600 hover:bg-red-700"
                                    : "bg-red-300 cursor-not-allowed"
                                }`}
                              >
                                {reportLoading
                                  ? "Submitting..."
                                  : "Submit Report"}
                              </button>
                              {reportSuccess && (
                                <p className="text-green-600 text-sm mt-1">
                                  Report submitted successfully!
                                </p>
                              )}
                              {reportError && (
                                <p className="text-red-600 text-sm mt-1">
                                  {reportError.message || "An error occurred"}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Cancel Booking
            </h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for cancellation:
            </p>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Reason for cancellation..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              required
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={confirmCancel}
                disabled={!cancelReason.trim()}
                className={`px-4 py-2 rounded-lg text-white ${
                  cancelReason.trim()
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-red-300 cursor-not-allowed"
                }`}
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
