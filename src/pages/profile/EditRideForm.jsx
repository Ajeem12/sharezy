import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { fetchUserRides, updateRide } from "../../redux/features/profile/usersRidesSlice";
import { fetchSuggestion } from "../../redux/features/suggestionSlice";
import { MdLocationOn, MdSwapHoriz } from "react-icons/md";
import { FiCheck, FiX } from "react-icons/fi";
import { toast } from 'sonner';


const EditRidePage = () => {
  const { rideId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux selectors
  const rides = useSelector((state) => state.usersRides.rides);
  const updateStatus = useSelector((state) => state.usersRides.updateStatus);
  const error = useSelector((state) => state.usersRides.error);
  const suggestions = useSelector((state) => state.suggestion);

  // Find the current ride
  const ride = rides.find((r) => r.id === parseInt(rideId));

  // Form state
  const [formData, setFormData] = useState({
    source: "",
    destination: "",
    riding_date: "",
    riding_time: "",
    seat: "",
    vehicle_no: "",
    vehicle_name: "",
    price: "",
    remark: "",
    status: 1, // Change is_active to status (1 for active, 0 for inactive)
  });

  // Location select states
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);

  // Fetch ride data if not available
  useEffect(() => {
    if (!ride) {
      dispatch(fetchUserRides());
    }
  }, [dispatch, ride]);

  // Initialize form data when ride is available
  useEffect(() => {
    if (ride) {
      setFormData({
        source: ride.source || "",
        destination: ride.destination || "",
        riding_date: ride.riding_date || "",
        riding_time: ride.riding_time ? ride.riding_time.slice(11, 16) : "",
        seat: ride.seat || "",
        vehicle_no: ride.vehicle_no || "",
        vehicle_name: ride.vehicle_name || "",
        price: ride.price || "",
        remark: ride.remark || "",
        status: ride.status === 1 ? 1 : 0, // Map active status to 1/0
      });

      // Initialize location selects
      setSource({ value: ride.source, label: ride.source });
      setDestination({ value: ride.destination, label: ride.destination });
    }
  }, [ride]);

  // Handle input change for suggestions
  const handleInputChange = (inputValue, field) => {
    if (inputValue && inputValue.length > 1) {
      dispatch(fetchSuggestion({ input: inputValue, field }));
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle location select changes
  const handleLocationChange = (selectedOption, field) => {
    const value = selectedOption ? selectedOption.value : "";
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "source") {
      setSource(selectedOption);
    } else {
      setDestination(selectedOption);
    }
  };

  // Swap source and destination
  const handleSwapLocations = () => {
    const temp = source;
    setSource(destination);
    setDestination(temp);
    setFormData((prev) => ({
      ...prev,
      source: prev.destination,
      destination: prev.source,
    }));
  };

  // Toggle ride status (1 for active, 0 for inactive)
  const toggleRideStatus = () => {
    setFormData((prev) => ({
      ...prev,
      status: prev.status === 1 ? 0 : 1, // Toggle between 1 and 0
    }));
  };

  // Form submission
  const handleSubmit = (e) => {
  e.preventDefault();
  const updatedData = {
    ...formData,
    riding_time: `${formData.riding_date} ${formData.riding_time}:00`,
  };

  dispatch(updateRide({ rideId, updatedData }))
    .unwrap()
    .then(() => {
      toast.success("Ride updated successfully!");
      navigate("/dashboard/myrides");
    })
    .catch((err) => {
      console.error("Update failed:", err);
      toast.error("Failed to update ride. Please try again.");
    });
};

  // Custom styles for react-select
  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: "52px",
      borderRadius: "0.375rem",
      borderColor: "#d1d5db",
      "&:hover": {
        borderColor: "#93c5fd",
      },
      boxShadow: "none",
    }),
    input: (provided) => ({
      ...provided,
      paddingLeft: "36px",
      color: "#111827",
    }),
    placeholder: (provided) => ({
      ...provided,
      paddingLeft: "36px",
      color: "#9ca3af",
    }),
    singleValue: (provided) => ({
      ...provided,
      paddingLeft: "36px",
      color: "#111827",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 20,
    }),
  };

  if (!ride) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg animate-pulse">Loading ride data...</p>
      </div>
    );
  }

  return (
    <div className=" px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Edit Ride Details</h2>
            <p className="mt-2 text-gray-600">Update your ride information</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Location Section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5">
                <label htmlFor="source" className="block mb-2 text-sm font-medium text-gray-700">
                  Source
                </label>
                <div className="relative">
                  <MdLocationOn
                    size={20}
                    className="absolute left-3 top-3.5 text-blue-500 pointer-events-none"
                  />
                  <Select
                    inputId="source"
                    name="source"
                    value={source}
                    onChange={(option) => handleLocationChange(option, "source")}
                    onInputChange={(val) => handleInputChange(val, "from")}
                    options={(suggestions.from?.data || []).map((city) => ({
                      value: city.city_name,
                      label: city.city_name,
                    }))}
                    isLoading={suggestions.from?.status === "loading"}
                    isClearable
                    placeholder="Select source city"
                    styles={customSelectStyles}
                    classNamePrefix="react-select"
                  />
                </div>
              </div>

              <div className="md:col-span-2 flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleSwapLocations}
                  aria-label="Swap locations"
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
                >
                  <MdSwapHoriz size={24} />
                </button>
              </div>

              <div className="md:col-span-5">
                <label htmlFor="destination" className="block mb-2 text-sm font-medium text-gray-700">
                  Destination
                </label>
                <div className="relative">
                  <MdLocationOn
                    size={20}
                    className="absolute left-3 top-3.5 text-red-500 pointer-events-none"
                  />
                  <Select
                    inputId="destination"
                    name="destination"
                    value={destination}
                    onChange={(option) => handleLocationChange(option, "destination")}
                    onInputChange={(val) => handleInputChange(val, "to")}
                    options={(suggestions.to?.data || []).map((city) => ({
                      value: city.city_name,
                      label: city.city_name,
                    }))}
                    isLoading={suggestions.to?.status === "loading"}
                    isClearable
                    placeholder="Select destination city"
                    styles={customSelectStyles}
                    classNamePrefix="react-select"
                  />
                </div>
              </div>
            </div>

            {/* Date and Time Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="riding_date" className="block mb-2 text-sm font-medium text-gray-700">
                  Riding Date
                </label>
                <input
                  type="date"
                  id="riding_date"
                  name="riding_date"
                  value={formData.riding_date}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-lg border-gray-300 px-4 py-2.5 text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label htmlFor="riding_time" className="block mb-2 text-sm font-medium text-gray-700">
                  Riding Time
                </label>
                <input
                  type="time"
                  id="riding_time"
                  name="riding_time"
                  value={formData.riding_time}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border-gray-300 px-4 py-2.5 text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>

            {/* Vehicle Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="vehicle_name" className="block mb-2 text-sm font-medium text-gray-700">
                  Vehicle Name
                </label>
                <input
                  type="text"
                  id="vehicle_name"
                  name="vehicle_name"
                  value={formData.vehicle_name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border-gray-300 px-4 py-2.5 text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label htmlFor="vehicle_no" className="block mb-2 text-sm font-medium text-gray-700">
                  Vehicle Number
                </label>
                <input
                  type="text"
                  id="vehicle_no"
                  name="vehicle_no"
                  value={formData.vehicle_no}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border-gray-300 px-4 py-2.5 text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>

            {/* Price and Seats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-700">
                  Price (₹)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full rounded-lg border-gray-300 px-4 py-2.5 text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label htmlFor="seat" className="block mb-2 text-sm font-medium text-gray-700">
                  Available Seats
                </label>
                <input
                  type="number"
                  id="seat"
                  name="seat"
                  value={formData.seat}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full rounded-lg border-gray-300 px-4 py-2.5 text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>

            {/* Ride Status Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Enable Ride Sharing</h3>
                <p className="text-xs text-gray-500">
                  {formData.status === 1 ? "Your ride is visible to others" : "Your ride is currently hidden"}
                </p>
              </div>
              <button
                type="button"
                onClick={toggleRideStatus}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  formData.status === 1 ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.status === 1 ? "translate-x-6" : "translate-x-1"
                  }`}
                />
                {formData.status === 1 ? (
                  <FiCheck className="absolute left-1 text-white text-xs" />
                ) : (
                  <FiX className="absolute right-1 text-gray-500 text-xs" />
                )}
              </button>
            </div>

            {/* Remark Section */}
            <div>
              <label htmlFor="remark" className="block mb-2 text-sm font-medium text-gray-700">
                Additional Information
              </label>
              <textarea
                id="remark"
                name="remark"
                rows={3}
                value={formData.remark}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 px-4 py-2.5 text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Any special instructions or notes for passengers..."
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={updateStatus === "loading"}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium transition ${
                  updateStatus === "loading"
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {updateStatus === "loading" ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  "Update Ride"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditRidePage;
