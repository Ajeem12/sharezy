import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import FilterSidebar from "../components/RideFilter";
import RideListing from "../components/RideCard";
import RideForm from "../components/RideForm";
import PopularRides from "../components/PopularRides";

const RideListingPage = () => {
  const location = useLocation();

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Sample ride data (replace with your actual data or API)
  const initialRides = [];

  const [rides, setRides] = useState(initialRides);
  const [filteredRides, setFilteredRides] = useState(initialRides);

  // Filters state with fareMin, fareMax, and departureTime only
  const [filters, setFilters] = useState({
    fareMin: "",
    fareMax: "",
    departureTime: "", // e.g., "morning", "afternoon", "evening"
    sortBy: "departure",
  });

  // Extract from and to from query params
  const queryParams = new URLSearchParams(location.search);
  const from = queryParams.get("from") || "No City Selected";
  const to = queryParams.get("to") || "No City Selected";

  // Filter rides based on from and to query params
  useEffect(() => {
    const filteredByRoute = initialRides.filter(
      (ride) =>
        ride.pickup.toLowerCase().includes(from.toLowerCase()) &&
        ride.dropoff.toLowerCase().includes(to.toLowerCase())
    );
    setRides(filteredByRoute);

    // Reset filters when route changes
    setFilters({
      fareMin: "",
      fareMax: "",
      departureTime: "",
      sortBy: "departure",
    });
  }, [from, to]);

  // Apply fareMin, fareMax, departureTime filters and sorting
  useEffect(() => {
    let results = [...rides];

    // Filter by departureTime (morning: 5-12, afternoon: 12-17, evening: 17-21)
    if (filters.departureTime) {
      results = results.filter((ride) => {
        const hour = parseInt(ride.departure.split(":")[0], 10);
        if (filters.departureTime === "morning") return hour >= 5 && hour < 12;
        if (filters.departureTime === "afternoon")
          return hour >= 12 && hour < 17;
        if (filters.departureTime === "evening") return hour >= 17 && hour < 21;
        return true;
      });
    }

    // Filter by fareMin
    if (filters.fareMin) {
      results = results.filter((ride) => {
        const price = parseInt(ride.price.replace(/[^\d]/g, ""), 10);
        return price >= Number(filters.fareMin);
      });
    }

    // Filter by fareMax
    if (filters.fareMax) {
      results = results.filter((ride) => {
        const price = parseInt(ride.price.replace(/[^\d]/g, ""), 10);
        return price <= Number(filters.fareMax);
      });
    }

    // Sort results
    switch (filters.sortBy) {
      case "price-asc":
        results.sort(
          (a, b) =>
            parseInt(a.price.replace(/[^\d]/g, "")) -
            parseInt(b.price.replace(/[^\d]/g, ""))
        );
        break;
      case "price-desc":
        results.sort(
          (a, b) =>
            parseInt(b.price.replace(/[^\d]/g, "")) -
            parseInt(a.price.replace(/[^\d]/g, ""))
        );
        break;
      case "rating":
        results.sort((a, b) => b.rating - a.rating);
        break;
      default: // departure time
        results.sort((a, b) => a.departure.localeCompare(b.departure));
    }

    setFilteredRides(results);
  }, [filters, rides]);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-2">
        <h1 className="text-2xl font-bold mb-6">
          {from} to {to} Rides
        </h1>
        <RideForm />

        {/* Toggle Button for Mobile */}
        <button
          className="md:hidden fixed bottom-20 right-8 z-50 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition flex items-center space-x-2"
          onClick={() => setIsFilterOpen(true)}
          aria-label="Open Filters"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 019 17v-3.586L3.293 6.707A1 1 0 013 6V4z"
            />
          </svg>
          <span>Filters</span>
        </button>

        <div className="flex flex-col md:flex-row gap-6 py-6">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />
          <RideListing
            ridesData={filteredRides}
            filterOptions={filters}
            updateFilters={setFilters}
          />
        </div>
      </div>
      <PopularRides />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
};

export default RideListingPage;
