import React, { useState, useEffect } from "react";
import RideForm from "../components/RideForm";
import LastSearchedRide from "../components/LastSearchedRide";
import SharezyLoader from "../components/SharezyLoader";

const Search = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay (e.g. fetching data or preloading)
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 second loading time

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 z-999">
      <div className="max-w-7xl mx-auto">
        {loading ? (
          // Loader Spinner
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-30">
            <SharezyLoader />
          </div>
        ) : (
          <>
            {/* Heading */}
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-blue-500 mb-2">
                Find a Ride
              </h1>
              <p className="text-gray-600 text-sm">
                Enter your details to search available carpooling options
              </p>
            </div>

            {/* Ride Search Form */}
            <div className="bg-white rounded-xl mb-10">
              <RideForm />
            </div>

            {/* Last Searched Ride */}
            <LastSearchedRide />
          </>
        )}
      </div>
      <br />
      <br />
      <br />
      <br />
    </div>
  );
};

export default Search;
