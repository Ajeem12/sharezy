// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   FiCalendar,
//   FiUsers,
//   FiMapPin,
//   FiX,
//   FiEdit2,
//   FiClock,
//   FiChevronLeft,
//   FiUser,
//   FiCheckCircle,
// } from "react-icons/fi";
// import { motion, AnimatePresence } from "framer-motion";
// import { useNavigate, Link } from "react-router-dom";
// import RideRequestsList from "./RideRequestsList";
// import {
//   fetchUserRides,
//   cancelRide,
//   startRide,
//   verifyOtpBooking,
// } from "../../redux/features/profile/usersRidesSlice";
// import SharezyLoader from "../../components/SharezyLoader";
// import ErrorMessage from "../../components/ErrorMessage";
// import { updateBookingStatus } from "../../redux/features/profile/approveRidesSlice";
// import { FaCar } from "react-icons/fa";
// import { toast } from "sonner";

// const MyRides = () => {
//   const dispatch = useDispatch();
//   const { rides, status, error } = useSelector((state) => state.usersRides);
//   const [activeTab, setActiveTab] = useState("upcoming");
//   const [showCancelModal, setShowCancelModal] = useState(false);
//   const [rideToCancel, setRideToCancel] = useState(null);
//   const [showRequests, setShowRequests] = useState(false);
//   const [selectedRide, setSelectedRide] = useState(null);
//   const [showOtpModal, setShowOtpModal] = useState(false);
//   const [selectedRideForOtp, setSelectedRideForOtp] = useState(null);
//   const [selectedBookingForOtp, setSelectedBookingForOtp] = useState(null);
//   const [enteredOtp, setEnteredOtp] = useState("");
//   const [isStartingRide, setIsStartingRide] = useState(false);
//   const [startedRides, setStartedRides] = useState([]);
//   const [showPassengerSelect, setShowPassengerSelect] = useState(false);
//   const [selectedPassengerIndex, setSelectedPassengerIndex] = useState(0);
//   const [currentRideForPassengers, setCurrentRideForPassengers] =
//     useState(null);
//   // OTP states: track rides where OTPs were sent and per-booking OTP inputs / status
//   const [otpSentRides, setOtpSentRides] = useState([]); // ride ids
//   const [otpInputs, setOtpInputs] = useState({}); // { [bookingId]: '12' }
//   const [verifying, setVerifying] = useState({}); // { [bookingId]: bool }
//   const [verified, setVerified] = useState({}); // { [bookingId]: bool }
//   const navigate = useNavigate();

//   useEffect(() => {
//     dispatch(fetchUserRides());
//   }, [dispatch]);

//   const safeRides = Array.isArray(rides)
//     ? rides
//         .flat()
//         .map((ride, index) => ({
//           ...ride,
//           uniqueId: `${ride.id}-${index}`,
//           rideDateTime: new Date(ride.riding_time),
//           driver: {
//             id: 17,
//             name: "Arun Chandrakar",
//             email: "testing@gmail.com",
//             mobile: "9977784726",
//             profile_image: "user1750490896_1000384307.jpg",
//             location: "Bhilai",
//           },
//         }))
//         .sort((a, b) => b.rideDateTime - a.rideDateTime)
//     : [];

//   const handleCancelRide = (id) => {
//     setRideToCancel(id);
//     setShowCancelModal(true);
//   };

//   const confirmCancel = async () => {
//     if (!rideToCancel) return;
//     try {
//       await dispatch(cancelRide({ ride_id: rideToCancel, status: 2 })).unwrap();
//       toast.success("Ride cancelled successfully.");
//     } catch (error) {
//       toast.error("Failed to cancel ride.");
//     } finally {
//       setShowCancelModal(false);
//       setRideToCancel(null);
//     }
//   };

//   const viewAllRequests = (ride) => {
//     setSelectedRide(ride);
//     setShowRequests(true);
//   };

//   const closeRequestsView = () => {
//     setShowRequests(false);
//     setSelectedRide(null);
//   };

//   const isCompleted = (ride) => {
//     const rideDate = new Date(ride.riding_date);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     rideDate.setHours(0, 0, 0, 0);
//     return rideDate < today;
//   };

//   const handleVerifyOtp = async () => {
//     if (!/^\d{2}$/.test(enteredOtp)) {
//       toast.error("Please enter a valid 2-digit OTP");
//       return;
//     }

//     setIsStartingRide(true);
//     try {
//       const response = await dispatch(
//         verifyOtpBooking({
//           bookingId: selectedBookingForOtp.id,
//           otp: enteredOtp,
//         })
//       ).unwrap();

//       toast.success(response.message || "OTP verified successfully");

//       // await handleStartRide();
//       // Add ride ID to startedRides array
//       setStartedRides((prev) => [...prev, selectedRideForOtp.id]);
//       setShowOtpModal(false);
//       setSelectedRideForOtp(null);
//       setSelectedBookingForOtp(null);
//       setEnteredOtp("");
//       dispatch(fetchUserRides());
//     } catch (error) {
//       toast.error(error.message || "OTP verification failed");
//     } finally {
//       setIsStartingRide(false);
//     }
//   };

//   const handleStartRide = async (id) => {
//     try {
//       const responce = await dispatch(startRide(id)).unwrap();
//       toast.success(
//         responce?.message ||
//           responce?.payload?.message ||
//           "OTP sent to passengers"
//       );

//       // mark OTPs sent for this ride and initialize inputs for each booking
//       setOtpSentRides((s) => Array.from(new Set([...s, id])));
//       const ride = safeRides.find((r) => r.id === id);
//       if (ride?.booked_rides?.length) {
//         setOtpInputs((prev) => {
//           const next = { ...prev };
//           ride.booked_rides.forEach((b) => {
//             if (b && b.id) next[b.id] = "";
//           });
//           return next;
//         });
//       }
//     } catch (error) {
//       toast.error(error?.message || "Failed to start ride / send OTP");
//       throw error;
//     }
//   };

//   const handleConfirmRequest = async (rideId, bookingId) => {
//     try {
//       await dispatch(
//         updateBookingStatus({ rideId, bookingId, status: 1 })
//       ).unwrap();
//     } catch (error) {
//       console.error("Error accepting booking:", error);
//     }
//   };

//   const handleCancelRequest = async (rideId, bookingId) => {
//     try {
//       await dispatch(
//         updateBookingStatus({ rideId, bookingId, status: 2 })
//       ).unwrap();
//     } catch (error) {
//       console.error("Error declining booking:", error);
//     }
//   };

//   const filteredRides = safeRides.filter((ride) => {
//     const [year, month, day] = ride.riding_date.split("-");
//     const rideDateOnly = new Date(year, month - 1, day);
//     const now = new Date();
//     const todayOnly = new Date(
//       now.getFullYear(),
//       now.getMonth(),
//       now.getDate()
//     );
//     const rideTime = rideDateOnly.getTime();
//     const todayTime = todayOnly.getTime();

//     const include =
//       (ride.status === 0 || ride.status === 1) && rideTime >= todayTime;
//     if (activeTab === "upcoming") return include;
//     if (activeTab === "completed")
//       return ride.status === 1 && rideTime < todayTime;
//     if (activeTab === "cancelled") return ride.status === 2;
//     return true;
//   });

//   if (status === "loading") {
//     return (
//       <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-30">
//         <SharezyLoader />
//       </div>
//     );
//   }

//   if (status === "failed") {
//     return (
//       <div className="max-w-xl mx-auto mt-10 p-6 border border-red-300 bg-red-50 rounded-lg text-red-800 text-center shadow-md">
//         <p className="font-semibold text-lg">Error loading rides</p>
//         <p className="mt-2 text-sm">{error || "Something went wrong."}</p>
//         <button
//           onClick={() => dispatch(fetchUserRides())}
//           className="mt-4 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded shadow transition"
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-2 sm:p-6 lg:p-4 mb-20">
//       {/* Header Section */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//         <div>
//           <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
//             {showRequests ? "Ride Requests" : "My Rides"}
//           </h1>
//           <p className="text-gray-500 mt-2 text-sm sm:text-base max-w-lg">
//             {showRequests
//               ? `Requests for your ride `
//               : "Manage your published rides and requests"}
//           </p>
//         </div>
//         {showRequests && (
//           <button
//             onClick={closeRequestsView}
//             className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
//           >
//             <FiChevronLeft />
//             Back to rides
//           </button>
//         )}
//       </div>

//       {showRequests ? (
//         <RideRequestsList
//           ride={selectedRide}
//           onConfirm={handleConfirmRequest}
//           onCancel={handleCancelRequest}
//         />
//       ) : (
//         <>
//           {/* Tabs */}
//           <div className="flex border-b border-gray-200 mb-6 overflow-x-auto no-scrollbar">
//             <button
//               onClick={() => setActiveTab("upcoming")}
//               className={`px-4 py-3 whitespace-nowrap font-medium ${
//                 activeTab === "upcoming"
//                   ? "text-blue-600 border-b-2 border-blue-600"
//                   : "text-gray-500 hover:text-gray-700"
//               }`}
//             >
//               Upcoming
//             </button>
//             <button
//               onClick={() => setActiveTab("completed")}
//               className={`px-4 py-3 whitespace-nowrap font-medium ${
//                 activeTab === "completed"
//                   ? "text-blue-600 border-b-2 border-blue-600"
//                   : "text-gray-500 hover:text-gray-700"
//               }`}
//             >
//               Completed
//             </button>
//             <button
//               onClick={() => setActiveTab("cancelled")}
//               className={`px-4 py-3 whitespace-nowrap font-medium ${
//                 activeTab === "cancelled"
//                   ? "text-blue-600 border-b-2 border-blue-600"
//                   : "text-gray-500 hover:text-gray-700"
//               }`}
//             >
//               Cancelled
//             </button>
//           </div>

//           {/* Rides List */}
//           {filteredRides.length === 0 ? (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="text-center py-16 rounded-xl bg-gray-50"
//             >
//               <div className="mx-auto w-24 h-24 sm:w-28 sm:h-28 bg-blue-50 rounded-full flex items-center justify-center mb-6">
//                 <FiMapPin className="text-blue-400 text-4xl" />
//               </div>
//               <h3 className="text-xl sm:text-2xl font-medium text-gray-800 mb-3">
//                 No rides published yet
//               </h3>
//               <p className="text-gray-500 max-w-xs sm:max-w-md mx-auto mb-8 px-4">
//                 Share your travel plans and earn by offering rides to fellow
//                 travelers heading the same way.
//               </p>
//               <button className="px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md text-sm sm:text-base">
//                 Publish Your First Ride
//               </button>
//             </motion.div>
//           ) : (
//             <div className="grid gap-6">
//               <AnimatePresence>
//                 {filteredRides.map((ride) => (
//                   <motion.div
//                     key={ride.uniqueId}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, x: -20 }}
//                     transition={{ duration: 0.3 }}
//                     className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-100"
//                   >
//                     <div className="p-6">
//                       <div className="flex flex-col md:flex-row justify-between gap-6">
//                         {/* Ride Info */}
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-center gap-3 mb-4">
//                             <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
//                               <FiMapPin className="text-blue-600 text-xl" />
//                             </div>
//                             <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
//                               <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
//                                 {ride.source}{" "}
//                                 <span className="text-blue-500 mx-2">→</span>{" "}
//                                 {ride.destination}
//                               </h3>
//                               <span
//                                 className={`px-2 py-1 text-xs text-center rounded-full ${
//                                   ride.status === 1
//                                     ? "bg-green-100 text-green-700"
//                                     : ride.status === 0
//                                     ? "bg-yellow-100 text-yellow-700"
//                                     : "bg-red-100 text-red-700"
//                                 }`}
//                               >
//                                 {ride.status === 1
//                                   ? "Active"
//                                   : ride.status === 0
//                                   ? "Inactive"
//                                   : "Cancelled"}
//                               </span>
//                             </div>
//                           </div>

//                           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-700 text-sm sm:text-base">
//                             <div className="flex items-center gap-2">
//                               <FiCalendar className="text-gray-400 flex-shrink-0" />
//                               <span>
//                                 {new Date(ride.riding_date).toLocaleDateString(
//                                   "en-US",
//                                   {
//                                     weekday: "short",
//                                     month: "short",
//                                     day: "numeric",
//                                   }
//                                 )}
//                               </span>
//                             </div>
//                             <div className="flex items-center gap-2">
//                               <FiClock className="text-gray-400 flex-shrink-0" />{" "}
//                               <span>
//                                 {new Date(ride.riding_time).toLocaleTimeString(
//                                   [],
//                                   {
//                                     hour: "2-digit",
//                                     minute: "2-digit",
//                                   }
//                                 )}
//                               </span>
//                             </div>
//                             <div className="flex items-center gap-2">
//                               <FiUsers className="text-gray-400 flex-shrink-0" />
//                               <span>
//                                 {ride.seat} seat
//                                 {ride.seat !== 1 ? "s" : ""} available
//                               </span>
//                             </div>
//                             <div className="flex items-center gap-2 truncate">
//                               <FaCar className="w-4 h-4 text-gray-400 flex-shrink-0" />
//                               <span className="truncate">
//                                 {ride.vehicle_name} ({ride.vehicle_no})
//                               </span>
//                             </div>
//                           </div>
//                         </div>

//                         {/* Price and Actions */}
//                         <div className="flex flex-col items-end gap-4 min-w-[140px]">
//                           <div className="text-right">
//                             <div className="text-xl sm:text-2xl font-bold text-gray-900">
//                               ₹{ride.price}
//                             </div>
//                             <div className="text-xs sm:text-sm text-gray-500">
//                               per seat
//                             </div>
//                           </div>
//                           <div className="flex gap-3 flex-wrap justify-end">
//                             {!isCompleted(ride) && (
//                               <>
//                                 {!isCompleted(ride) &&
//                                   (ride.status === 0 || ride.status === 1) &&
//                                   (ride.booked_rides?.length ?? 0) === 0 && (
//                                     <button className="px-4 py-2 flex items-center gap-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs sm:text-sm">
//                                       <FiEdit2 size={16} />
//                                       <Link
//                                         to={`/dashboard/edit-ride/${ride.id}`}
//                                       >
//                                         Edit
//                                       </Link>
//                                     </button>
//                                   )}

//                                 {!isCompleted(ride) &&
//                                   (ride.status === 0 || ride.status === 1) &&
//                                   (ride.booked_rides?.length ?? 0) === 0 && (
//                                     <button
//                                       onClick={() => handleCancelRide(ride.id)}
//                                       className="px-4 py-2 flex items-center gap-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs sm:text-sm"
//                                     >
//                                       <FiX size={16} />
//                                       <span>Cancel</span>
//                                     </button>
//                                   )}
//                               </>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Passenger Details Section */}
//                     <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
//                       <div className="mb-4">
//                         <h4 className="text-sm font-semibold text-gray-800 mb-3">
//                           Passengers ({ride.booked_rides?.length || 0})
//                         </h4>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//                           {(ride.booked_rides || []).map((booking, idx) => {
//                             const passengerName =
//                               booking.booked_user_details?.name || "Unknown";
//                             const isStarted = booking.confirm === 1;
//                             return (
//                               <div
//                                 key={idx}
//                                 className={`p-4 rounded-lg border-2 transition-all ${
//                                   isStarted
//                                     ? "bg-green-50 border-green-300"
//                                     : "bg-white border-gray-200"
//                                 }`}
//                               >
//                                 <div className="flex items-start justify-between gap-4">
//                                   <div className="flex-1 min-w-0">
//                                     <p className="font-medium text-gray-800 truncate">
//                                       {passengerName}
//                                     </p>
//                                     <p className="text-xs text-gray-600">
//                                       Seat: {booking.seat}
//                                     </p>
//                                   </div>

//                                   {/* inline OTP input + verify when OTPs were sent for this ride */}
//                                   {!isStarted &&
//                                   otpSentRides.includes(ride.id) ? (
//                                     <div className="flex items-center gap-2">
//                                       <input
//                                         value={otpInputs[booking.id] || ""}
//                                         onChange={(e) =>
//                                           handleOtpChange(
//                                             booking.id,
//                                             e.target.value
//                                           )
//                                         }
//                                         maxLength={2}
//                                         className="w-16 text-center px-2 py-1 border rounded-lg"
//                                         placeholder="00"
//                                       />
//                                     </div>
//                                   ) : isStarted ? (
//                                     <FiCheckCircle className="text-green-600 flex-shrink-0" />
//                                   ) : null}
//                                 </div>
//                               </div>
//                             );
//                           })}
//                         </div>
//                       </div>
//                       {activeTab === "upcoming" && (
//                         <div className="flex items-center gap-4 flex-wrap pt-4 border-t border-gray-200">
//                           {ride.booked_rides?.length > 0 &&
//                             !startedRides.includes(ride.id) &&
//                             ride.booked_rides?.some((b) => b.confirm === 0) && (
//                               <button
//                                 className="text-sm font-medium text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg shadow"
//                                 onClick={() => {
//                                   if (ride.booked_rides?.length === 1) {
//                                     // Single passenger, start directly
//                                     setSelectedRideForOtp(ride);
//                                     handleStartRide(ride.id);
//                                     setSelectedBookingForOtp(
//                                       ride.booked_rides[0]
//                                     );
//                                     setEnteredOtp("");
//                                     setShowOtpModal(true);
//                                   } else {
//                                     // Multiple passengers, show selection
//                                     setCurrentRideForPassengers(ride);
//                                     setSelectedPassengerIndex(0);
//                                     setShowPassengerSelect(true);
//                                   }
//                                 }}
//                               >
//                                 Start Ride
//                               </button>
//                             )}
//                           {ride.booked_rides?.every((b) => b.confirm === 1) && (
//                             <div className="flex items-center gap-1 text-green-600">
//                               <FiCheckCircle className="text-lg" />
//                               <span className="text-sm font-medium">
//                                 Rides Started
//                               </span>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </motion.div>
//                 ))}
//               </AnimatePresence>
//             </div>
//           )}
//         </>
//       )}

//       {/* OTP Verification Modal */}
//       {showOtpModal && selectedRideForOtp && selectedBookingForOtp && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
//           onClick={() => setShowOtpModal(false)}
//         >
//           <motion.div
//             initial={{ scale: 0.9 }}
//             animate={{ scale: 1 }}
//             exit={{ scale: 0.9 }}
//             onClick={(e) => e.stopPropagation()}
//             className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
//           >
//             <div className="flex justify-between items-start mb-6">
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-900">
//                   Passenger Verification
//                 </h2>
//                 <p className="text-gray-600 mt-1">
//                   Verify passenger OTP before starting the ride
//                 </p>
//               </div>
//               <button
//                 onClick={() => setShowOtpModal(false)}
//                 className="text-gray-400 hover:text-gray-600 p-1"
//               >
//                 <FiX size={24} />
//               </button>
//             </div>

//             {/* Ride Summary */}
//             <div className="bg-blue-50 rounded-xl p-5 mb-6">
//               <h3 className="text-lg font-semibold text-blue-800 mb-3">
//                 Ride Details
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="flex items-start gap-3">
//                   <FiMapPin className="text-blue-600 mt-1 flex-shrink-0" />
//                   <div>
//                     <p className="font-medium text-gray-700">Route</p>
//                     <p className="text-gray-600">
//                       {selectedRideForOtp.source} →{" "}
//                       {selectedRideForOtp.destination}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-start gap-3">
//                   <FiCalendar className="text-blue-600 mt-1 flex-shrink-0" />
//                   <div>
//                     <p className="font-medium text-gray-700">Date & Time</p>
//                     <p className="text-gray-600">
//                       {new Date(
//                         selectedRideForOtp.riding_date
//                       ).toLocaleDateString()}{" "}
//                       at {selectedRideForOtp.riding_time}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Passenger Verification */}
//             <div className="mb-6">
//               <h3 className="text-xl font-semibold text-gray-800 mb-4">
//                 Passenger Details
//               </h3>
//               <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
//                 <div className="flex items-center gap-4 mb-4">
//                   <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
//                     <FiUser size={20} />
//                   </div>
//                   <div>
//                     <h4 className="font-medium text-gray-800">
//                       {selectedBookingForOtp.booked_user_details?.name ||
//                         "Passenger"}
//                     </h4>
//                     <p className="text-sm text-gray-600">
//                       Seat: {selectedBookingForOtp.seat}
//                     </p>
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Enter OTP (2 digits)
//                   </label>
//                   <input
//                     type="text"
//                     maxLength={2}
//                     value={enteredOtp}
//                     onChange={(e) =>
//                       setEnteredOtp(
//                         e.target.value.replace(/\D/g, "").slice(0, 2)
//                       )
//                     }
//                     className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-center text-lg"
//                     placeholder="00"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => setShowOtpModal(false)}
//                 className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleVerifyOtp}
//                 disabled={
//                   !enteredOtp || enteredOtp.length !== 2 || isStartingRide
//                 }
//                 className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
//               >
//                 {isStartingRide ? "Verifying..." : "Verify OTP & Start Ride"}
//               </button>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}

//       {/* Cancel Ride Modal */}
//       {showCancelModal && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
//           onClick={() => setShowCancelModal(false)}
//         >
//           <motion.div
//             initial={{ scale: 0.9, y: 20 }}
//             animate={{ scale: 1, y: 0 }}
//             exit={{ scale: 0.9, y: 20 }}
//             onClick={(e) => e.stopPropagation()}
//             className="bg-white rounded-2xl p-6 w-full max-w-md"
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-bold text-gray-900">Cancel Ride</h3>
//               <button
//                 onClick={() => setShowCancelModal(false)}
//                 className="text-gray-400 hover:text-gray-600"
//                 aria-label="Close modal"
//               >
//                 <FiX size={24} />
//               </button>
//             </div>
//             <p className="text-gray-600 mb-6 text-sm sm:text-base">
//               Are you sure you want to cancel this ride? Passengers will be
//               notified and you won't be able to undo this action.
//             </p>
//             <div className="flex justify-end gap-3 flex-wrap">
//               <button
//                 onClick={() => setShowCancelModal(false)}
//                 className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
//               >
//                 No, keep ride
//               </button>
//               <button
//                 onClick={confirmCancel}
//                 className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
//               >
//                 Yes, cancel it
//               </button>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}

//       {/* Passenger Selection Modal */}
//       {showPassengerSelect && currentRideForPassengers && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
//           onClick={() => setShowPassengerSelect(false)}
//         >
//           <motion.div
//             initial={{ scale: 0.9 }}
//             animate={{ scale: 1 }}
//             exit={{ scale: 0.9 }}
//             onClick={(e) => e.stopPropagation()}
//             className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
//           >
//             <div className="flex justify-between items-start mb-6">
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-900">
//                   Select Passenger
//                 </h2>
//                 <p className="text-gray-600 mt-1">
//                   Choose a passenger to verify and start the ride
//                 </p>
//               </div>
//               <button
//                 onClick={() => setShowPassengerSelect(false)}
//                 className="text-gray-400 hover:text-gray-600 p-1"
//               >
//                 <FiX size={24} />
//               </button>
//             </div>

//             {/* Ride Summary */}
//             <div className="bg-blue-50 rounded-xl p-5 mb-6">
//               <h3 className="text-lg font-semibold text-blue-800 mb-3">
//                 Route
//               </h3>
//               <p className="text-gray-700">
//                 {currentRideForPassengers.source} →{" "}
//                 {currentRideForPassengers.destination}
//               </p>
//             </div>

//             {/* Passenger List */}
//             <div className="mb-6">
//               <h3 className="text-sm font-medium text-gray-700 mb-3">
//                 Available Passengers
//               </h3>
//               <div className="space-y-2 max-h-64 overflow-y-auto">
//                 {(currentRideForPassengers.booked_rides || []).map(
//                   (booking, idx) => {
//                     const isSelected = idx === selectedPassengerIndex;
//                     const passengerName =
//                       booking.booked_user_details?.name || "Unknown";
//                     const isStarted = booking.confirm === 1;

//                     if (isStarted) return null; // Skip already started rides

//                     return (
//                       <button
//                         key={idx}
//                         onClick={() => setSelectedPassengerIndex(idx)}
//                         className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
//                           isSelected
//                             ? "bg-blue-50 border-blue-500"
//                             : "bg-white border-gray-200 hover:border-gray-300"
//                         }`}
//                       >
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <p className="font-medium text-gray-800">
//                               {passengerName}
//                             </p>
//                             <p className="text-sm text-gray-600">
//                               Seat: {booking.seat}
//                             </p>
//                           </div>
//                           {isSelected && (
//                             <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
//                               <svg
//                                 className="w-3 h-3 text-white"
//                                 fill="currentColor"
//                                 viewBox="0 0 20 20"
//                               >
//                                 <path
//                                   fillRule="evenodd"
//                                   d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                                   clipRule="evenodd"
//                                 />
//                               </svg>
//                             </div>
//                           )}
//                         </div>
//                       </button>
//                     );
//                   }
//                 )}
//               </div>
//             </div>

//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => setShowPassengerSelect(false)}
//                 className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => {
//                   const selectedBooking =
//                     currentRideForPassengers.booked_rides[
//                       selectedPassengerIndex
//                     ];
//                   setSelectedRideForOtp(currentRideForPassengers);
//                   setSelectedBookingForOtp(selectedBooking);
//                   handleStartRide(currentRideForPassengers.id);
//                   setEnteredOtp("");
//                   setShowOtpModal(true);
//                   setShowPassengerSelect(false);
//                 }}
//                 className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//               >
//                 Verify & Send OTP
//               </button>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </div>
//   );
// };

// export default MyRides;

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiCalendar,
  FiUsers,
  FiMapPin,
  FiX,
  FiEdit2,
  FiClock,
  FiChevronLeft,
  FiCheckCircle,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import RideRequestsList from "./RideRequestsList";
import {
  fetchUserRides,
  cancelRide,
  startRide,
  verifyOtpBooking,
} from "../../redux/features/profile/usersRidesSlice";
import SharezyLoader from "../../components/SharezyLoader";
import ErrorMessage from "../../components/ErrorMessage";
import { updateBookingStatus } from "../../redux/features/profile/approveRidesSlice";
import { FaCar } from "react-icons/fa";
import { toast } from "sonner";

const MyRides = () => {
  const dispatch = useDispatch();
  const { rides, status, error } = useSelector((state) => state.usersRides);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [rideToCancel, setRideToCancel] = useState(null);
  const [showRequests, setShowRequests] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);

  // rides started (for UI)
  const [startedRides, setStartedRides] = useState([]);

  // OTP states
  const [otpSentRides, setOtpSentRides] = useState([]);
  const [otpInputs, setOtpInputs] = useState({});
  const [verifying, setVerifying] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUserRides());
  }, [dispatch]);

  const safeRides = Array.isArray(rides)
    ? rides
        .flat()
        .map((ride, index) => ({
          ...ride,
          uniqueId: `${ride.id}-${index}`,
          rideDateTime: new Date(ride.riding_time),
          driver: {
            id: 17,
            name: "Arun Chandrakar",
            email: "testing@gmail.com",
            mobile: "9977784726",
            profile_image: "user1750490896_1000384307.jpg",
            location: "Bhilai",
          },
        }))
        .sort((a, b) => b.rideDateTime - a.rideDateTime)
    : [];

  const handleCancelRide = (id) => {
    setRideToCancel(id);
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    if (!rideToCancel) return;
    try {
      await dispatch(cancelRide({ ride_id: rideToCancel, status: 2 })).unwrap();
      toast.success("Ride cancelled successfully.");
    } catch (error) {
      toast.error("Failed to cancel ride.");
    } finally {
      setShowCancelModal(false);
      setRideToCancel(null);
    }
  };

  const viewAllRequests = (ride) => {
    setSelectedRide(ride);
    setShowRequests(true);
  };

  const closeRequestsView = () => {
    setShowRequests(false);
    setSelectedRide(null);
  };

  const isCompleted = (ride) => {
    const rideDate = new Date(ride.riding_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    rideDate.setHours(0, 0, 0, 0);
    return rideDate < today;
  };

  const handleStartRide = async (id) => {
    try {
      const response = await dispatch(startRide(id)).unwrap();
      toast.success(
        response?.message ||
          response?.payload?.message ||
          "OTP sent to passengers"
      );

      // mark OTPs sent for this ride and initialize inputs for each booking
      setOtpSentRides((s) => Array.from(new Set([...s, id])));
      const ride = safeRides.find((r) => r.id === id);
      if (ride?.booked_rides?.length) {
        setOtpInputs((prev) => {
          const next = { ...prev };
          ride.booked_rides.forEach((b) => {
            if (b && b.id) next[b.id] = "";
          });
          return next;
        });
      }
    } catch (error) {
      toast.error(error?.message || "Failed to start ride / send OTP");
      throw error;
    }
  };

  const handleConfirmRequest = async (rideId, bookingId) => {
    try {
      await dispatch(
        updateBookingStatus({ rideId, bookingId, status: 1 })
      ).unwrap();
    } catch (error) {
      console.error("Error accepting booking:", error);
    }
  };

  const handleCancelRequest = async (rideId, bookingId) => {
    try {
      await dispatch(
        updateBookingStatus({ rideId, bookingId, status: 2 })
      ).unwrap();
    } catch (error) {
      console.error("Error declining booking:", error);
    }
  };

  const handleOtpChange = (bookingId, value) => {
    const cleaned = value.replace(/\D/g, ""); // only digits
    setOtpInputs((prev) => ({
      ...prev,
      [bookingId]: cleaned.slice(0, 2), // max 2 digits
    }));
  };

  const handleVerifyAllBookings = async (ride) => {
    const pendingBookings = (ride.booked_rides || []).filter(
      (b) => b.confirm === 0
    );

    if (!pendingBookings.length) {
      toast.error("No passengers pending verification.");
      return;
    }

    const bookingArray = [];

    // validate OTP for each pending booking
    for (const b of pendingBookings) {
      const otp = otpInputs[b.id];
      if (!/^\d{2}$/.test(otp || "")) {
        toast.error(
          `Please enter a valid 2-digit OTP for ${
            b.booked_user_details?.name || "a passenger"
          }`
        );
        return;
      }
      bookingArray.push({
        bookingId: b.id,
        otp,
      });
    }

    try {
      await dispatch(
        verifyOtpBooking({
          rideId: ride.id,
          array: bookingArray,
        })
      ).unwrap();

      toast.success("All passengers verified successfully.");
      setStartedRides((prev) => Array.from(new Set([...prev, ride.id])));
      dispatch(fetchUserRides());
    } catch (error) {
      toast.error(error?.message || "OTP verification failed.");
    } finally {
      setVerifying({});
    }
  };

  const filteredRides = safeRides.filter((ride) => {
    const [year, month, day] = ride.riding_date.split("-");
    const rideDateOnly = new Date(year, month - 1, day);
    const now = new Date();
    const todayOnly = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const rideTime = rideDateOnly.getTime();
    const todayTime = todayOnly.getTime();

    const include =
      (ride.status === 0 || ride.status === 1) && rideTime >= todayTime;
    if (activeTab === "upcoming") return include;
    if (activeTab === "completed")
      return ride.status === 1 && rideTime < todayTime;
    if (activeTab === "cancelled") return ride.status === 2;
    return true;
  });

  if (status === "loading") {
    return (
      <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-30">
        <SharezyLoader />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 border border-red-300 bg-red-50 rounded-lg text-red-800 text-center shadow-md">
        <p className="font-semibold text-lg">Error loading rides</p>
        <p className="mt-2 text-sm">{error || "Something went wrong."}</p>
        <button
          onClick={() => dispatch(fetchUserRides())}
          className="mt-4 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded shadow transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-6 lg:p-4 mb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            {showRequests ? "Ride Requests" : "My Rides"}
          </h1>
          <p className="text-gray-500 mt-2 text-sm sm:text-base max-w-lg">
            {showRequests
              ? `Requests for your ride `
              : "Manage your published rides and requests"}
          </p>
        </div>
        {showRequests && (
          <button
            onClick={closeRequestsView}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <FiChevronLeft />
            Back to rides
          </button>
        )}
      </div>

      {showRequests ? (
        <RideRequestsList
          ride={selectedRide}
          onConfirm={handleConfirmRequest}
          onCancel={handleCancelRequest}
        />
      ) : (
        <>
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-4 py-3 whitespace-nowrap font-medium ${
                activeTab === "upcoming"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`px-4 py-3 whitespace-nowrap font-medium ${
                activeTab === "completed"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setActiveTab("cancelled")}
              className={`px-4 py-3 whitespace-nowrap font-medium ${
                activeTab === "cancelled"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Cancelled
            </button>
          </div>

          {/* Rides List */}
          {filteredRides.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 rounded-xl bg-gray-50"
            >
              <div className="mx-auto w-24 h-24 sm:w-28 sm:h-28 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <FiMapPin className="text-blue-400 text-4xl" />
              </div>
              <h3 className="text-xl sm:text-2xl font-medium text-gray-800 mb-3">
                No rides published yet
              </h3>
              <p className="text-gray-500 max-w-xs sm:max-w-md mx-auto mb-8 px-4">
                Share your travel plans and earn by offering rides to fellow
                travelers heading the same way.
              </p>
              <button className="px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md text-sm sm:text-base">
                Publish Your First Ride
              </button>
            </motion.div>
          ) : (
            <div className="grid gap-6">
              <AnimatePresence>
                {filteredRides.map((ride) => (
                  <motion.div
                    key={ride.uniqueId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-100"
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-6">
                        {/* Ride Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                              <FiMapPin className="text-blue-600 text-xl" />
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                              <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                                {ride.source}{" "}
                                <span className="text-blue-500 mx-2">→</span>{" "}
                                {ride.destination}
                              </h3>
                              <span
                                className={`px-2 py-1 text-xs text-center rounded-full ${
                                  ride.status === 1
                                    ? "bg-green-100 text-green-700"
                                    : ride.status === 0
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {ride.status === 1
                                  ? "Active"
                                  : ride.status === 0
                                  ? "Inactive"
                                  : "Cancelled"}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-700 text-sm sm:text-base">
                            <div className="flex items-center gap-2">
                              <FiCalendar className="text-gray-400 flex-shrink-0" />
                              <span>
                                {new Date(ride.riding_date).toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FiClock className="text-gray-400 flex-shrink-0" />{" "}
                              <span>
                                {new Date(ride.riding_time).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FiUsers className="text-gray-400 flex-shrink-0" />
                              <span>
                                {ride.seat} seat
                                {ride.seat !== 1 ? "s" : ""} available
                              </span>
                            </div>
                            <div className="flex items-center gap-2 truncate">
                              <FaCar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <span className="truncate">
                                {ride.vehicle_name} ({ride.vehicle_no})
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Price and Actions */}
                        <div className="flex flex-col items-end gap-4 min-w-[140px]">
                          <div className="text-right">
                            <div className="text-xl sm:text-2xl font-bold text-gray-900">
                              ₹{ride.price}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500">
                              per seat
                            </div>
                          </div>
                          <div className="flex gap-3 flex-wrap justify-end">
                            {!isCompleted(ride) && (
                              <>
                                {!isCompleted(ride) &&
                                  (ride.status === 0 || ride.status === 1) &&
                                  (ride.booked_rides?.length ?? 0) === 0 && (
                                    <button className="px-4 py-2 flex items-center gap-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs sm:text-sm">
                                      <FiEdit2 size={16} />
                                      <Link
                                        to={`/dashboard/edit-ride/${ride.id}`}
                                      >
                                        Edit
                                      </Link>
                                    </button>
                                  )}

                                {!isCompleted(ride) &&
                                  (ride.status === 0 || ride.status === 1) &&
                                  (ride.booked_rides?.length ?? 0) === 0 && (
                                    <button
                                      onClick={() => handleCancelRide(ride.id)}
                                      className="px-4 py-2 flex items-center gap-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs sm:text-sm"
                                    >
                                      <FiX size={16} />
                                      <span>Cancel</span>
                                    </button>
                                  )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Passenger Details Section */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-800 mb-3">
                          Passengers ({ride.booked_rides?.length || 0})
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {(ride.booked_rides || []).map((booking, idx) => {
                            const passengerName =
                              booking.booked_user_details?.name || "Unknown";
                            const isStarted = booking.confirm === 1;

                            return (
                              <div
                                key={idx}
                                className={`p-4 rounded-lg border-2 transition-all ${
                                  isStarted
                                    ? "bg-green-50 border-green-300"
                                    : "bg-white border-gray-200"
                                }`}
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-800 truncate">
                                      {passengerName}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      Seat: {booking.seat}
                                    </p>
                                  </div>

                                  {/* inline OTP input when OTPs were sent for this ride */}
                                  {!isStarted &&
                                  otpSentRides.includes(ride.id) ? (
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="text"
                                        inputMode="numeric"
                                        value={otpInputs[booking.id] ?? ""}
                                        onChange={(e) =>
                                          handleOtpChange(
                                            booking.id,
                                            e.target.value
                                          )
                                        }
                                        maxLength={2}
                                        className="w-16 text-center px-2 py-1 border rounded-lg"
                                        placeholder="00"
                                      />
                                    </div>
                                  ) : isStarted ? (
                                    <FiCheckCircle className="text-green-600 flex-shrink-0" />
                                  ) : null}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {activeTab === "upcoming" && (
                        <div className="flex items-center gap-4 flex-wrap pt-4 border-t border-gray-200">
                          {ride.booked_rides?.length > 0 &&
                            !startedRides.includes(ride.id) &&
                            ride.booked_rides?.some((b) => b.confirm === 0) && (
                              <button
                                className="text-sm font-medium text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg shadow"
                                onClick={() => {
                                  // send OTPs and show inputs
                                  handleStartRide(ride.id);
                                }}
                              >
                                Start Ride (Send OTP)
                              </button>
                            )}

                          {otpSentRides.includes(ride.id) &&
                            ride.booked_rides?.some((b) => b.confirm === 0) && (
                              <button
                                onClick={() => handleVerifyAllBookings(ride)}
                                className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow"
                                disabled={Object.values(verifying).some(
                                  Boolean
                                )}
                              >
                                {Object.values(verifying).some(Boolean)
                                  ? "Verifying..."
                                  : "Verify All"}
                              </button>
                            )}

                          {ride.booked_rides?.every((b) => b.confirm === 1) && (
                            <div className="flex items-center gap-1 text-green-600">
                              <FiCheckCircle className="text-lg" />
                              <span className="text-sm font-medium">
                                Rides Started
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </>
      )}

      {/* Cancel Ride Modal */}
      {showCancelModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowCancelModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Cancel Ride</h3>
              <button
                onClick={() => setShowCancelModal(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close modal"
              >
                <FiX size={24} />
              </button>
            </div>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              Are you sure you want to cancel this ride? Passengers will be
              notified and you won't be able to undo this action.
            </p>
            <div className="flex justify-end gap-3 flex-wrap">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
              >
                No, keep ride
              </button>
              <button
                onClick={confirmCancel}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Yes, cancel it
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default MyRides;
