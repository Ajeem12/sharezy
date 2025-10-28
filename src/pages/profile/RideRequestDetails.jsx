// src/pages/profile/RideRequestDetails.jsx
import React from 'react';
import { FiChevronLeft, FiMapPin, FiClock, FiCalendar, FiUsers, FiDollarSign } from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';
 // We'll create this mock data file

const RideRequestDetails = () => {
  const { rideId, requestId } = useParams();
  const navigate = useNavigate();
  
  // Find the ride and request
  const ride = rides.find(r => r.id === parseInt(rideId));
 const request = ride?.requests.find(r => r.id === parseInt(requestId));

  if (!ride || !request) {
    return <div>Request not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <FiChevronLeft className="text-xl" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Request Details</h1>
          <p className="text-gray-500">Passenger details for your ride</p>
        </div>
      </div>

      {/* Ride Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 p-2 rounded-lg">
            <FiMapPin className="text-blue-600 text-xl" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">
            {ride.from} → {ride.to}
          </h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <FiCalendar className="text-gray-400" />
            <span>{new Date(ride.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiClock className="text-gray-400" />
            <span>{ride.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiUsers className="text-gray-400" />
            <span>{request.seatsRequested} seat(s)</span>
          </div>
          <div className="flex items-center gap-2">
           
            <span>₹{ride.price * request.seatsRequested}</span>
          </div>
        </div>
      </div>

      {/* Passenger Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Passenger Information</h2>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-shrink-0">
              <img 
                src={request.userImage} 
                alt={request.userName}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
              />
            </div>
            
            <div className="flex-1">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900">{request.userName}</h3>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(request.userRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-sm text-gray-500 ml-1">
                    {request.userRating} ({request.reviewCount || '12'} reviews)
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Pickup Location</h4>
                  <p className="text-gray-900">{request.pickupLocation}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Drop Location</h4>
                  <p className="text-gray-900">{request.dropLocation}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Contact Number</h4>
                  <p className="text-gray-900">{request.phoneNumber || 'Not provided'}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Status</h4>
                  <p className="text-gray-900 capitalize">{request.status}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Additional Notes</h4>
                <p className="text-gray-900">
                  {request.notes || "No additional notes provided by the passenger."}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
          <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            Decline
          </button>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Accept Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default RideRequestDetails;