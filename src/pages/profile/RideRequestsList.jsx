import React, { useState, useEffect } from "react";
import {
  FiUser,
  FiPhoneCall,
  FiMapPin,
  FiUsers,
  FiDollarSign,
  FiCalendar,
  FiCheck,
  FiX,
  FiMail,
} from "react-icons/fi";

const RideRequestsList = ({ ride, onConfirm, onCancel }) => {
  const [confirmPopup, setConfirmPopup] = useState(null);
  const [localStatuses, setLocalStatuses] = useState({});
  const [loadingBookingId, setLoadingBookingId] = useState(null);

  
  

  useEffect(() => {
    if (ride?.booked_rides) {
      const initialStatuses = {};
      ride.booked_rides.forEach((booking) => {
        initialStatuses[booking.id] = booking.status;
      });
      setLocalStatuses(initialStatuses);
    }
  }, [ride]);

  if (
    !ride ||
    !Array.isArray(ride.booked_rides) ||
    ride.booked_rides.length === 0
  ) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
        <p className="text-gray-500">No booking requests available</p>
      </div>
    );
  }

  const handleConfirmAction = async () => {
    if (!confirmPopup) return;
    const { bookingId, action } = confirmPopup;

    try {
      setLoadingBookingId(bookingId); // Start loader

      // Optimistic UI update
      setLocalStatuses((prev) => ({
        ...prev,
        [bookingId]: action === "accept" ? 1 : 2,
      }));

      // API Call
      if (action === "accept") {
        await onConfirm(ride.id, bookingId);
      } else {
        await onCancel(ride.id, bookingId);
      }
    } catch (error) {
      console.error("Error:", error);
      setLocalStatuses((prev) => ({
        ...prev,
        [bookingId]: 0, // Revert on error
      }));
    } finally {
      setLoadingBookingId(null); // Stop loader
      setConfirmPopup(null);
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 0: // Pending
        return null; // Show buttons
      case 1: // Accepted
        return {
          text: "Booking Accepted",
          icon: <FiCheck className="inline mr-1" />,
          color: "text-green-600",
        };
      case 2: // Declined
        return {
          text: "Booking Declined",
          icon: <FiX className="inline mr-1" />,
          color: "text-red-600",
        };
      default:
        return null;
    }
  };

  return (
    <div className="grid gap-4 relative">
      {ride.booked_rides.map((booking) => {
        const user = booking.booked_user_details;
        // Use local status if available, otherwise fall back to API status
        const displayStatus = localStatuses[booking.id] ?? booking.status;
        const statusDisplay = getStatusDisplay(displayStatus);

        return (
          <div
            key={booking.id}
            className="bg-white p-5 rounded-xl shadow-xs border border-gray-100 hover:shadow-sm transition-shadow relative"
          >
            {/* ... rest of your booking card JSX ... */}
            <div className="flex flex-col sm:flex-row gap-5">
              {/* Passenger Info */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <FiUser className="text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {user?.name || "Unknown"}
                    </h3>
                    <p className="text-xs text-gray-500">Passenger</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <FiPhoneCall className="text-gray-400 flex-shrink-0" />
                    <span>{user?.mobile || "Not provided"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FiMail className="text-gray-400 flex-shrink-0" />
                    <span>{user?.email || "Not provided"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm col-span-2">
                    <FiMapPin className="text-gray-400 flex-shrink-0" />
                    <span className="truncate">
                      {user?.location || "Location not specified"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-l border-gray-100 hidden sm:block"></div>

              {/* Booking Info */}
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Seats</p>
                    <p className="font-medium flex items-center gap-1">
                      <FiUsers className="text-gray-400" />
                      {booking.seat}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Price</p>
                    <p className="font-medium flex items-center gap-1">
                     ₹{booking.price}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Booking Date</p>
                  <p className="font-medium flex items-center gap-1">
                    <FiCalendar className="text-gray-400" />
                    {new Date(booking.booking_date).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Status or Actions */}
            {statusDisplay ? (
              <div
                className={`mt-5 pt-4 border-t font-semibold ${statusDisplay.color}`}
              >
                {statusDisplay.icon}
                {statusDisplay.text}
              </div>
            ) : (
              <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-gray-100">
                <button
                  onClick={() =>
                    setConfirmPopup({
                      bookingId: booking.id,
                      action: "decline",
                    })
                  }
                  disabled={loadingBookingId === booking.id}
                  className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 border transition-colors ${
                    loadingBookingId === booking.id
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
                  }`}
                >
                  {loadingBookingId === booking.id &&
                  confirmPopup?.action === "decline" ? (
                    <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <FiX className="text-gray-500" />
                      Decline
                    </>
                  )}
                </button>

                <button
                  onClick={() =>
                    setConfirmPopup({ bookingId: booking.id, action: "accept" })
                  }
                  disabled={loadingBookingId === booking.id}
                  className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                    loadingBookingId === booking.id
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white`}
                >
                  {loadingBookingId === booking.id &&
                  confirmPopup?.action === "accept" ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <FiCheck />
                      Accept
                    </>
                  )}
                </button>
              </div>
            )}
             

            {/* Confirmation Popup */}
            {confirmPopup && confirmPopup.bookingId === booking.id && (
              <>
                {/* Overlay */}
                <div
                  onClick={() => setConfirmPopup(null)}
                  className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40"
                ></div>

                {/* Modal */}
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-center relative">
                    <div className="text-4xl mb-4 inline-block text-gray-700">
                      {confirmPopup.action === "accept" ? (
                        <FiCheck className="mx-auto text-green-600" />
                      ) : (
                        <FiX className="mx-auto text-red-600" />
                      )}
                    </div>
                    <h2 className="text-lg font-semibold mb-2">
                      {confirmPopup.action === "accept"
                        ? "Confirm Acceptance"
                        : "Confirm Decline"}
                    </h2>
                    <p className="mb-6 text-gray-600">
                      Are you sure you want to{" "}
                      <span className="font-semibold text-gray-900">
                        {confirmPopup.action === "accept"
                          ? "accept"
                          : "decline"}
                      </span>{" "}
                      this booking?
                    </p>

                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => setConfirmPopup(null)}
                        className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirmAction}
                        className={`px-5 py-2 rounded-lg text-white transition ${
                          confirmPopup.action === "accept"
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                      >
                        Yes,{" "}
                        {confirmPopup.action === "accept"
                          ? "Accept"
                          : "Decline"}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RideRequestsList;
