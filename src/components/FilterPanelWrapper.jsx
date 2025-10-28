import React, { useState } from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa';
import FilterSidebar from '../components/FilterSidebar';

const FilterPanelWrapper = ({ filters, setFilters }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="md:hidden p-4">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md"
        >
          <FaFilter />
          Filter
        </button>
      </div>

      {/* Sidebar Drawer for Mobile */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden shadow-lg`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Filters</h3>
          <button onClick={() => setIsOpen(false)}>
            <FaTimes className="text-xl text-gray-600" />
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(100%-60px)] p-4">
          <FilterSidebar filters={filters} setFilters={setFilters} />
        </div>
      </div>

      {/* Always visible on Desktop */}
      <div className="hidden md:block">
        <FilterSidebar filters={filters} setFilters={setFilters} />
      </div>
    </>
  );
};

export default FilterPanelWrapper;
