import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { RiSearchLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

const LastSearchedRides = () => {
  const [searches, setSearches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      const parsed = JSON.parse(stored);

      // Step 1: Remove entries with empty 'from' or 'to'
      const validSearches = parsed.filter(
        s => s.from?.trim() && s.to?.trim()
      );

      // Step 2: Remove duplicate entries
      const uniqueSearches = Array.from(new Set(validSearches.map(s => JSON.stringify(s))))
        .map(s => JSON.parse(s));

      // Step 3: Update state and localStorage
      setSearches(uniqueSearches);
      localStorage.setItem('recentSearches', JSON.stringify(uniqueSearches));
    }
  }, []);

  const clearAll = () => {
    localStorage.removeItem('recentSearches');
    setSearches([]);
  };

  const handleSearchAgain = (ride) => {
    const query = new URLSearchParams({
      from: ride.from,
      to: ride.to,
      date: ride.date,
      passengers: ride.passengers,
    }).toString();

    navigate(`/rides?${query}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl p-3 md:p-4 shadow-xl border border-gray-100 mt-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <RiSearchLine className="text-blue-600 text-xl" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Your Recent Searches</h2>
        </div>
        {searches.length > 0 && (
          <button
            className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
            onClick={clearAll}
          >
            Clear All
          </button>
        )}
      </div>

      {searches.length === 0 ? (
        <p className="text-gray-500 text-center">No recent searches found.</p>
      ) : (
        <div className="grid gap-5">
          {searches.map((ride, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gray-50 border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-5">
                {/* Route Info */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FaMapMarkerAlt className="text-blue-600" />
                    </div>
                    <div className="h-6 w-0.5 bg-gray-300 my-1" />
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <FaMapMarkerAlt className="text-red-600 rotate-180" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{ride.from}</h3>
                    <div className="h-0.5 w-6 bg-gray-300 my-2" />
                    <h3 className="text-lg font-semibold text-gray-800">{ride.to}</h3>

                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-blue-500" />
                        <span>{ride.date || '—'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaUser className="text-purple-500" />
                        <span>{ride.passengers} {ride.passengers > 1 ? 'People' : 'Person'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Search Again Button */}
                <div className="flex md:justify-end">
                  <button
                    onClick={() => handleSearchAgain(ride)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition shadow"
                  >
                    <RiSearchLine />
                    Search Again
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* View History Button */}
      {searches.length > 0 && (
        <div className="mt-6 text-center">
          <button className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center justify-center gap-2">
            View all search history ({searches.length})
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round"
                strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default LastSearchedRides;
