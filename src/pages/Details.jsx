import React, { useEffect, useState } from "react";
import { FaStar, FaUserFriends, FaCheckCircle } from "react-icons/fa";
import {
  FaSuitcase,
  FaSnowflake,
  FaMusic,
  FaRoute,
  FaCarSide,
  FaCar,
  FaIdBadge,
} from "react-icons/fa6";
import { IoTimeOutline, IoCalendarOutline } from "react-icons/io5";
import {
  MdOutlineAirlineSeatReclineNormal,
  MdPriceChange,
  MdOutlineStickyNote2,
} from "react-icons/md";
import { FiUser } from "react-icons/fi";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  confirmRideBooking,
  getRideDetails,
} from "../redux/features/rideBookingSlice";
import { useParams } from "react-router-dom";
import SharezyLoader from "../components/SharezyLoader";
import { toast } from "sonner";

const ride_Details = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get ride details from Redux state
  const { rideDetails, loading, error } = useSelector(
    (state) => state.rideBooking
  );

  const { rideId } = useParams(); // Get rideId from the URL

  useEffect(() => {
    console.log("useEffect triggered");
    // if (rideId) {
    console.log("Dispatching action with rideId:", rideId);
    dispatch(getRideDetails(rideId)); // Dispatch the action to get ride details
    // }
  }, [dispatch, rideId]);

  const [selectedSeats, setSelectedSeats] = useState(1); // Default selected seats to 1
  const [totalPrice, setTotalPrice] = useState(rideDetails?.price || 0); // Calculate total price based on sele

  useEffect(() => {
    if (rideDetails && selectedSeats) {
      setTotalPrice(rideDetails.price * selectedSeats); // Total price based on selected seats
    }
  }, [selectedSeats, rideDetails]);

  const handleSeatsChange = (e) => {
    const seats = Number(e.target.value);
    setSelectedSeats(seats); // Update selected seats
  };

  const availableSeats = Math.max(
    0,
    rideDetails?.seat - (rideDetails?.booked_rides_count || 0)
  );

  // Handle booking
  // Handle booking
  const handleBooking = () => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (!storedUser || !storedToken) {
      // Not logged in
      navigate("/login"); // Redirect to login
      return;
    }

    if (availableSeats === 0) {
      toast.error("No seats available for this ride.");
      return;
    }

    if (rideDetails && rideDetails.id && rideDetails.price && selectedSeats) {
      const totalPrice = rideDetails.price * selectedSeats;

      dispatch(
        confirmRideBooking({
          ride_id: rideDetails.id,
          price: totalPrice,
          seat: selectedSeats,
        })
      )
        .unwrap()
        .then((res) => {
          toast.success("Booking successful!");
           navigate("/success");
          dispatch(getRideDetails(rideId)); // Refetch ride details after successful booking
        })
        .catch((err) => {
          toast.error("Booking failed. Please try again.");
          console.error(err);
        });
    } else {
      toast.warn("Please select valid seat and ride.");
    }
  };

  // Handle success page navigation
  const handleClick = () => {
    navigate("/success");
  };

  if (loading)
    return (
      <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-30">
        <SharezyLoader />
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  const defaultVehicleImg = "https://via.placeholder.com/150?text=No+Image";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
          Ride Details
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column */}
          <div className="w-full lg:w-2/3 space-y-6">
            {/* Trip Overview Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaRoute className="text-blue-600 text-xl" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Trip Overview
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Trip Details */}
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="mt-1">
                    <FaRoute className="text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Route</p>
                    <p className="font-medium text-gray-800">
                      {rideDetails?.source} → {rideDetails?.destination}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="mt-1">
                    <IoCalendarOutline className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date</p>
                    <p className="font-medium text-gray-800">
                      {new Date(rideDetails?.riding_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="mt-1">
                    <IoTimeOutline className="text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Time</p>
                    <p className="font-medium text-gray-800">
                      {new Date(rideDetails?.riding_time).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="mt-1">
                    <MdOutlineAirlineSeatReclineNormal className="text-teal-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Seats</p>
                    <p className="font-medium text-gray-800">
                      {rideDetails?.seat - rideDetails?.booked_rides_count}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="mt-1">
                    <MdPriceChange className="text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Price</p>
                    <p className="font-medium text-gray-800">
                      ₹{rideDetails?.price}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 mt-4 bg-gray-50 rounded-lg">
                <div className="mt-1">
                  <MdOutlineStickyNote2 className="text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Remarks</p>
                  <p className="font-medium text-gray-800">
                    {rideDetails?.remark}
                  </p>
                </div>
              </div>
            </div>

            {/* Driver Info Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FaUserFriends className="text-green-600 text-xl" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Driver Information
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                  {rideDetails?.user_details?.profile_image ? (
                    <img
                      src={`${
                        import.meta.env.VITE_IMAGE_BASE_URL
                      }/uploads/users/${
                        rideDetails.user_details.profile_image
                      }`}
                      alt="Driver"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <FiUser className="text-gray-500 text-3xl" />
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {rideDetails?.user_details?.name}
                      </h3>
                      <span className="text-blue-500" title="Verified driver">
                        <FaCheckCircle className="text-blue-500 text-sm" />
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <FaStar className="text-yellow-400" />
                      <span className="font-medium">
                        {rideDetails?.user_details?.rating || 4.5}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Location</p>
                      <p className="font-medium">
                        {rideDetails?.user_details?.location || "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">Mobile</p>
                      <p className="font-medium">
                        {rideDetails?.user_details?.mobile}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Info Card */}

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FaCarSide className="text-purple-600 text-xl" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Vehicle Details
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-shrink-0 w-full sm:w-48 h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden shadow-inner">
                  {rideDetails?.vehicle_image ? (
                    <img
                      src={`${
                        import.meta.env.VITE_IMAGE_BASE_URL
                      }/uploads/vehicles/${rideDetails.vehicle_image}`}
                      alt="Vehicle"
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <FaCarSide className="text-gray-400 text-5xl" />
                  )}
                </div>

                <div className="space-y-4 flex-grow">
                  <div className="flex items-center gap-2">
                    <FaCar className="text-gray-500" />
                    <span className="text-gray-500 font-medium">Car Name:</span>
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {rideDetails?.vehicle_name || "Unknown Vehicle"}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaIdBadge className="text-gray-500" />
                    <span className="text-gray-500 font-medium">
                      Car Number:
                    </span>
                    <h4 className="font-medium text-gray-600 text-md">
                      {rideDetails?.vehicle_no || "N/A"}
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Fellow Passengers Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <FaUserFriends className="text-yellow-600 text-xl" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Fellow Passengers
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {rideDetails?.booked_rides?.map((ride, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xl font-semibold text-gray-600">
                        {ride.booked_user_details?.name?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {ride.booked_user_details?.name}
                      </p>
                      <p className="text-xs text-gray-500">{ride.seat} Seat</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (Booking Summary) */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Book This Ride
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <span className="text-gray-500">Price per seat</span>
                  <span className="font-semibold">₹{rideDetails?.price}</span>
                </div>

                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <span className="text-gray-500">Seats available</span>
                  <span className="font-semibold">
                    {rideDetails?.seat - rideDetails?.booked_rides_count}
                  </span>
                </div>

                <div className="py-4 border-b border-gray-100">
                  <label
                    htmlFor="seats"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Select number of seats
                  </label>

                  {availableSeats > 0 ? (
                    <select
                      id="seats"
                      value={selectedSeats} // make sure you have this in your state
                      onChange={handleSeatsChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {Array.from({ length: availableSeats }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-red-600 font-semibold">
                      No seats available
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center py-4 border-b border-gray-100">
                  <span className="font-medium">Total</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ₹{totalPrice}
                  </span>
                </div>

                {availableSeats > 0 && (
                  <button
                    onClick={handleBooking}
                    disabled={loading}
                    className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-200 ${
                      loading ? "cursor-not-allowed opacity-70" : ""
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <SharezyLoader className="w-5 h-5 mr-2 text-white" />
                      </div>
                    ) : (
                      "Confirm Booking"
                    )}
                  </button>
                )}

                <p className="text-xs text-gray-500 text-center mt-3">
                  <FaCheckCircle className="inline mr-1 text-green-500" />
                  Free cancellation up to 24 hours before departure
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ride_Details;
