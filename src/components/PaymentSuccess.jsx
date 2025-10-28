import React from 'react';
import { FaCheckCircle, FaCar, FaMapMarkerAlt, FaCalendarAlt, FaUserAlt, FaRegSmileBeam } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PaymentSuccess = () => {
  // Sample booking data (would typically come from props or state)
  const booking = {
    id: 'RIDE789012',
    from: 'San Francisco',
    to: 'Los Angeles',
    date: '2023-07-15',
    time: '08:30 AM',
    seats: 2,
    price: 120,
    driver: 'Michael Johnson',
    car: 'Tesla Model 3 (CA-7890)',
    pickup: 'Union Square, SF',
    dropoff: 'Santa Monica Pier, LA',
    paymentMethod: 'VISA •••• 4242',
    paymentAmount: 240,
    paymentDate: '2023-06-10 14:30'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-4xl"
      >
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center text-white">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 1.5,
              ease: "easeInOut"
            }}
          >
            <FaCheckCircle className="text-6xl mx-auto mb-4" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-lg opacity-90">Your ride has been confirmed</p>
          <div className="mt-4 bg-white bg-opacity-20 inline-block px-4 py-2 rounded-full">
            <span className="font-medium">Booking ID: {booking.id}</span>
          </div>
        </div>

        {/* Booking Details */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Ride Information */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaCar className="text-blue-600 mr-2" /> Ride Details
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-green-500 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-gray-700">Route</p>
                    <p className="text-gray-900">{booking.from} → {booking.to}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaCalendarAlt className="text-blue-500 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-gray-700">Date & Time</p>
                    <p className="text-gray-900">{booking.date} at {booking.time}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaUserAlt className="text-purple-500 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-gray-700">Driver</p>
                    <p className="text-gray-900">{booking.driver}</p>
                    <p className="text-sm text-gray-500">{booking.car}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaRegSmileBeam className="text-yellow-500 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-gray-700">Passengers</p>
                    <p className="text-gray-900">{booking.seats} seat{booking.seats !== 1 ? 's' : ''} booked</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">${booking.price * booking.seats}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Fee:</span>
                  <span className="font-medium">$5.00</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-3 mt-3">
                  <span className="text-gray-800 font-bold">Total:</span>
                  <span className="text-green-600 font-bold">${booking.paymentAmount}</span>
                </div>
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <p className="text-gray-600 mb-1">Payment Method:</p>
                  <p className="font-medium">{booking.paymentMethod}</p>
                  <p className="text-sm text-gray-500 mt-2">Paid on {new Date(booking.paymentDate).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pickup/Dropoff Locations */}
          <div className="bg-blue-50 p-6 rounded-xl mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Location Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center text-blue-600 mb-2">
                  <FaMapMarkerAlt className="mr-2" />
                  <span className="font-medium">Pickup Point</span>
                </div>
                <p className="text-gray-800">{booking.pickup}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center text-green-600 mb-2">
                  <FaMapMarkerAlt className="mr-2" />
                  <span className="font-medium">Dropoff Point</span>
                </div>
                <p className="text-gray-800">{booking.dropoff}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/dashboard/booked"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md text-center font-medium"
            >
              View My Bookings
            </Link>
            <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium">
              Download Receipt
            </button>
            <Link
              to="/rides"
              className="px-6 py-3 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-colors shadow-sm text-center font-medium"
            >
              Book Another Ride
            </Link>
          </div>
        </div>

        {/* Footer Note */}
        <div className="bg-gray-50 p-4 text-center text-sm text-gray-500">
          Need help? <a href="#" className="text-blue-600 hover:underline">Contact our support team</a>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;