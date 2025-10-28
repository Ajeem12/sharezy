import React from 'react';
import { FaCarAlt, FaRoute, FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-2xl rounded-3xl overflow-hidden max-w-4xl w-full"
      >
        <div className="md:flex">
          {/* Visual Section */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 md:p-12 text-white md:w-2/5 flex flex-col justify-center items-center">
            <motion.div
              animate={{ 
                x: [0, 10, -10, 0],
                y: [0, -10, 5, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="mb-6"
            >
              <FaCarAlt className="text-8xl opacity-90" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">Lost in Transit?</h2>
            <p className="text-blue-100 text-center">Don't worry, we'll get you back on track</p>
          </div>

          {/* Content Section */}
          <div className="p-8 md:p-12 md:w-3/5">
            <div className="flex items-center justify-center mb-6">
              <span className="text-6xl font-bold text-blue-600 mr-2">4</span>
              <FaRoute className="text-5xl text-yellow-500 mx-2" />
              <span className="text-6xl font-bold text-blue-600 ml-2">4</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 text-center">
              Page Not Found
            </h1>
            
            <p className="text-gray-600 mb-8 text-center">
              The route you're looking for doesn't exist or may have been moved. 
              Let's navigate you back to familiar roads.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition-all duration-300"
              >
                <FaHome />
                Back to Home
              </Link>
              
              <Link
                to="/rides"
                className="flex items-center justify-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-all duration-300"
              >
                <FaCarAlt />
                Browse Rides
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500 text-center">
                Need help? <a href="#" className="text-blue-600 hover:underline">Contact our support team</a>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;