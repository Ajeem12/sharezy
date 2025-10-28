import React from 'react';
import { FaTimes, FaClock, FaDollarSign } from 'react-icons/fa';

const departureTimes = [
  { label: 'All', value: 'all' },
  { label: '00:00 - 01:00', value: '0-1' },
  { label: '01:00 - 02:00', value: '1-2' },
  { label: '02:00 - 03:00', value: '2-3' },
  { label: '03:00 - 04:00', value: '3-4' },
  { label: '04:00 - 05:00', value: '4-5' },
  { label: '05:00 - 06:00', value: '5-6' },
  { label: '06:00 - 07:00', value: '6-7' },
  { label: '07:00 - 08:00', value: '7-8' },
  { label: '08:00 - 09:00', value: '8-9' },
  { label: '09:00 - 10:00', value: '9-10' },
  { label: '10:00 - 11:00', value: '10-11' },
  { label: '11:00 - 12:00', value: '11-12' },
  { label: '12:00 - 13:00', value: '12-13' },
  { label: '13:00 - 14:00', value: '13-14' },
  { label: '14:00 - 15:00', value: '14-15' },
  { label: '15:00 - 16:00', value: '15-16' },
  { label: '16:00 - 17:00', value: '16-17' },
  { label: '17:00 - 18:00', value: '17-18' },
  { label: '18:00 - 19:00', value: '18-19' },
  { label: '19:00 - 20:00', value: '19-20' },
  { label: '20:00 - 21:00', value: '20-21' },
  { label: '21:00 - 22:00', value: '21-22' },
  { label: '22:00 - 23:00', value: '22-23' },
  { label: '23:00 - 00:00', value: '23-0' },
];


const RideFilter = ({ filters, setFilters, isOpen, onClose, onApply }) => {
  const changeDepartureTime = (e) => {
    setFilters({ ...filters, departureTime: e.target.value });
  };

  const changeFareMin = (e) => {
    const minFare = e.target.value === '' ? '' : Number(e.target.value);
    setFilters({ ...filters, fareMin: minFare });
  };

  const changeFareMax = (e) => {
    const maxFare = e.target.value === '' ? '' : Number(e.target.value);
    setFilters({ ...filters, fareMax: maxFare });
  };

  const applyFilters = () => {
    if (onApply) onApply();
  };

  if (!isOpen) {
    return (
      <aside className="hidden md:flex flex-col w-80 p-6 bg-white rounded-xl  sticky top-20 h-fit">
        <h2 className="text-2xl text-blue-500 font-semibold mb-6 border-b border-blue-400 pb-2">Filters</h2>

        {/* Fare */}
        <div className="mb-6">
          <label className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <span className="text-green-600"> ₹ </span>  Fare Range
          </label>
          <div className="flex gap-4">
            <input
              type="number"
              min="0"
              value={filters.fareMin === undefined ? '' : filters.fareMin}
              onChange={changeFareMin}
              placeholder="Min"
              className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="number"
              min="0"
              value={filters.fareMax === undefined ? '' : filters.fareMax}
              onChange={changeFareMax}
              placeholder="Max"
              className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Departure Time */}
        <div className="mb-6">
          <label className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FaClock className="text-yellow-500" /> Departure Time
          </label>
          <select
            value={filters.departureTime}
            onChange={changeDepartureTime}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {departureTimes.map((dt) => (
              <option key={dt.value} value={dt.value}>
                {dt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Apply Filter Button */}
       
      </aside>
    );
  }

  // Mobile sidebar
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center px-4">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl overflow-y-auto max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Filters</h2>
          <button
            onClick={onClose}
            className="text-3xl text-gray-600 hover:text-red-500 transition"
            aria-label="Close filters"
          >
            <FaTimes />
          </button>
        </div>

        {/* Fare */}
        <div className="mb-6">
          <label className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FaDollarSign className="text-green-600" /> Fare Range
          </label>
          <div className="flex gap-4">
            <input
              type="number"
              min="0"
              value={filters.fareMin === undefined ? '' : filters.fareMin}
              onChange={changeFareMin}
              placeholder="Min"
              className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="number"
              min="0"
              value={filters.fareMax === undefined ? '' : filters.fareMax}
              onChange={changeFareMax}
              placeholder="Max"
              className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Departure Time */}
        <div className="mb-6">
          <label className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FaClock className="text-yellow-500" /> Departure Time
          </label>
          <select
            value={filters.departureTime}
            onChange={changeDepartureTime}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {departureTimes.map((dt) => (
              <option key={dt.value} value={dt.value}>
                {dt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Apply Filter Button */}
       
      </div>
    </div>
  );
};

export default RideFilter;
