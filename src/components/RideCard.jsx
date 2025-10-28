import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  FaStar,
  FaCar,
  FaClock,
  FaMapMarkerAlt,
  FaUserAlt,
  FaMoneyBillWave,
} from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { searchRides } from "../redux/features/searchSlice";
import SharezyLoader from "../components/SharezyLoader";
import { FiUser } from "react-icons/fi";
const RideListing = ({ ridesData = [], filterOptions = {}, updateFilters }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const rides = useSelector((state) => state.search.rides || []);
  const error = useSelector((state) => state.search.error);

  const [filters, setFilters] = useState({ sortBy: "departure" });
  const [query, setQuery] = useState({
    from: "",
    to: "",
    date: "",
    passenger: 1,
  });

  const prevRouteRef = useRef({ from: "", to: "" });

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const from = queryParams.get("from");
    const to = queryParams.get("to");
    const date = queryParams.get("date");
    const passenger = parseInt(queryParams.get("passenger") || "1");

    const routeChanged =
      prevRouteRef.current.from !== from || prevRouteRef.current.to !== to;

    if (routeChanged && typeof updateFilters === "function") {
      updateFilters({
        fareMin: null,
        fareMax: null,
        departureTime: "all",
        sortBy: "departure",
        time: "",
      });
    }

    // update previous route values
    prevRouteRef.current = { from, to };

    if (from && to) {
      setQuery({ from, to, date, passenger });

      const payload = {
        source: from,
        destination: to,
        riding_date: date || "",
        passenger: passenger || 1,
      };

      // Add filters
      if (filterOptions.fareMin != null) payload.min = filterOptions.fareMin;
      if (filterOptions.fareMax != null) payload.max = filterOptions.fareMax;

      if (filterOptions.departureTime) {
        const [startHourStr, endHourStr] =
          filterOptions.departureTime.split("-");
        const startHour = parseInt(startHourStr, 10);
        const endHour = parseInt(endHourStr, 10);
        if (!isNaN(startHour) && !isNaN(endHour)) {
          payload.riding_time_start = `${String(startHour).padStart(
            2,
            "0"
          )}:00:00`;
          payload.riding_time_end = `${String(endHour).padStart(2, "0")}:00:00`;
        }
      }

      dispatch(searchRides(payload));
    }
  }, [location.search, dispatch, filterOptions, updateFilters]);

  const sortedRides = useMemo(() => {
    const sorted = [...rides];
    switch (filters.sortBy) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "departure":
        sorted.sort(
          (a, b) => new Date(a.riding_time) - new Date(b.riding_time)
        );
        break;
      case "rating":
        sorted.sort(
          (a, b) =>
            (b.user_details?.rating || 0) - (a.user_details?.rating || 0)
        );
        break;
      default:
        break;
    }
    return sorted;
  }, [rides, filters.sortBy]);

  if (error) {
    return (
      <div className="flex items-center justify-center  bg-red-50 p-4">
        <div className="text-center text-red-700 max-w-md bg-red-100 border border-red-300 rounded-lg p-6 shadow-md">
          <p className="text-xl font-semibold mb-2">
            Oops! Something went wrong.
          </p>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 md:px-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h2 className="text-xl font-semibold text-gray-800">
          Available Rides{" "}
          <span className="text-gray-500 text-base">
            ({sortedRides.length}) for {query.passenger} Passenger
            {query.passenger > 1 ? "s" : ""}
          </span>
        </h2>

        <div className="flex items-center gap-2"></div>
      </div>

      {/* Rides Listing */}
      {sortedRides.length > 0 ? (
        <div className="grid gap-4">
          {sortedRides.map((ride) => (
            <div
              key={ride.id}
              className="border border-gray-200 rounded-lg p-4 shadow hover:shadow-md transition bg-white"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                {/* Driver Info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {ride.user_details?.profile_image ? (
                      <img
                        src={`${
                          import.meta.env.VITE_IMAGE_BASE_URL
                        }/uploads/users/${ride.user_details.profile_image}`}
                        alt={ride.user_details?.name || "Driver"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = "none"; // hide broken image
                          e.target.parentNode.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A10.97 10.97 0 0112 15c2.485 0 4.77.816 6.879 2.194M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`;
                        }}
                      />
                    ) : (
                      <FiUser className="w-5 h-5 text-gray-500" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-gray-800">
                      {ride.user_details?.name || "Unknown Driver"}
                    </h3>
                    {ride.user_details?.rating && (
                      <p className="text-yellow-500 flex items-center text-sm">
                        <FaStar className="mr-1" />
                        {ride.user_details.rating.toFixed(1)} / 5
                      </p>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="text-xl font-bold text-blue-600">
                  ₹{ride.price}
                </div>
              </div>

              {/* Ride Details */}
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FaClock className="text-gray-400" />
                    <span>
                      <strong>Departure:</strong>{" "}
                      {new Date(ride.riding_time).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCar className="text-gray-400" />
                    <span>
                      <strong>Car:</strong> {ride.vehicle_name} (
                      {ride.vehicle_no})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IoIosPeople className="text-gray-400 text-base" />
                    <span>
                      {Number(ride.seat) - Number(ride.booked_rides_count) >
                      0 ? (
                        <>
                          <strong>Seats Available:</strong>{" "}
                          {Number(ride.seat) - Number(ride.booked_rides_count)}
                        </>
                      ) : (
                        <strong className="text-red-500">
                          No Seat Available
                        </strong>
                      )}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <FaMapMarkerAlt className="text-gray-400 mt-0.5" />
                    <div>
                      <strong>From:</strong> {ride.source}
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FaMapMarkerAlt className="text-gray-400 mt-0.5" />
                    <div>
                      <strong>To:</strong> {ride.destination}
                    </div>
                  </div>
                </div>
              </div>

              {/* Book Button */}
              {String(ride.user_id) !== localStorage.getItem("login") && (
                <button
                  onClick={() => navigate(`/details/${ride.id}`)}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2"
                >
                  <FaMoneyBillWave />
                  Book this ride
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-gray-400 text-5xl mb-3">🚗</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">
            No rides found
          </h3>
          <p className="text-gray-500 text-sm">
            Try changing your search criteria or check back later.
          </p>
        </div>
      )}
    </div>
  );
};

export default RideListing;
