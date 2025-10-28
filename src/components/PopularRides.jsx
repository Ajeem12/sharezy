import React, { useEffect, useRef } from 'react';
import { FaArrowRight, FaCarSide } from 'react-icons/fa';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { fetchMostVisitedRides, getMostVisited } from '../redux/features/mostVisitedSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' }
  },
  exit: {
    opacity: 0,
    y: 15,
    transition: { duration: 0.3, ease: 'easeIn' }
  }
};

const PopularRides = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const destinations = useSelector(getMostVisited);
  const status = useSelector((state) => state.mostVisited.status);
  const error = useSelector((state) => state.mostVisited.error);
  const [visibleCount, setVisibleCount] = React.useState(6);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  useEffect(() => {
    dispatch(fetchMostVisitedRides());
  }, [dispatch]);

  const handleShowMore = () => setVisibleCount(destinations.length);
  const handleHide = () => setVisibleCount(6);
  const visibleRides = destinations.slice(0, visibleCount);

  const handleSearchAgain = (ride) => {
    const today = new Date().toISOString().split("T")[0];
    navigate(`/rides?from=${ride.source}&to=${ride.destination}&date=${today}&passengers=1`);
    window.scrollTo(0, 0);
  };

  if (status === 'loading') {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
        <p className="text-blue-500">Loading popular rides...</p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 text-lg font-medium mb-2">Error loading data</div>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => dispatch(fetchMostVisitedRides())}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (status === 'succeeded' && destinations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No popular rides found</p>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-2 py-6">
      <h1 className="text-3xl font-extrabold text-blue-600 mb-8 text-center">
        Where Do You Want to Go?
      </h1>

      <div
        ref={containerRef}
        className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
      >
        <AnimatePresence initial={false}>
          {visibleRides.map((ride, index) => (
            <motion.div
              key={`${ride.source}-${ride.destination}-${index}`}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow cursor-pointer group"
            >
              <div className="flex items-center space-x-3 flex-1 overflow-hidden">
                <FaCarSide className="text-blue-500 text-2xl flex-shrink-0" />
                <div className="overflow-hidden">
                  <p
                    className="text-base font-semibold text-gray-800 group-hover:text-blue-600 transition whitespace-nowrap overflow-hidden text-ellipsis max-w-[180px] sm:max-w-[220px] md:max-w-[260px] lg:max-w-[280px]"
                    title={`${ride.source} → ${ride.destination}`}
                  >
                    {ride.source}{' '}
                    <FaArrowRight className="inline mx-1 text-blue-400" /> {ride.destination}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {ride.total_bookings} booking{ride.total_bookings !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSearchAgain(ride);
                }}
                className="ml-2 sm:ml-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm sm:text-base px-4 sm:px-5 py-1.5 rounded-md shadow-md transition whitespace-nowrap"
              >
                Book Now
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {destinations.length > 6 && (
        <div className="mt-8 flex justify-center sm:justify-end space-x-4">
          {visibleCount < destinations.length ? (
            <button
              onClick={handleShowMore}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-2.5 rounded-lg shadow-lg transition"
            >
              Show More
            </button>
          ) : (
            <button
              onClick={handleHide}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold px-6 py-2.5 rounded-lg shadow-lg transition"
            >
              Hide
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default PopularRides;
