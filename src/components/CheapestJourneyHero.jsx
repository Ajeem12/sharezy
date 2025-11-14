import React from "react";
import {
  FaGasPump,
  FaRupeeSign,
  FaUserFriends,
  FaArrowRight,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CheapestJourneyHero = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/publish");
  };
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="max-w-7xl mx-auto px-2 py-6 ">
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12">
        {/* Left Text Content */}
        <motion.div
          className="flex-1"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6"
            variants={itemVariants}
          >
            Driving soon? Let's make it{" "}
            <span className="text-blue-600 bg-blue-600 bg-clip-text ">
              super affordable.
            </span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl"
            variants={itemVariants}
          >
            Turn your solo drive into a smart trip. Share your ride, split the
            cost, and connect with fellow travelers. It's easy, secure, and
            cheaper than ever.
          </motion.p>

          {/* Features */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 mb-10"
            variants={containerVariants}
          >
            <motion.div
              className="flex items-center gap-3 bg-blue-50 rounded-lg px-4 py-3"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
            >
              <div className="bg-blue-100 p-2 rounded-full">
                <FaRupeeSign className="text-blue-600 text-xl" />
              </div>
              <p className="text-gray-800 font-medium">
                Save up to 70% fuel cost
              </p>
            </motion.div>

            <motion.div
              className="flex items-center gap-3 bg-blue-50 rounded-lg px-4 py-3"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
            >
              <div className="bg-blue-100 p-2 rounded-full">
                <FaUserFriends className="text-blue-600 text-xl" />
              </div>
              <p className="text-gray-800 font-medium">
                Meet verified co-riders
              </p>
            </motion.div>
          </motion.div>

          {/* CTA Button */}
          <motion.button
            className="group bg-blue-500 hover:to-blue-800 text-white text-lg font-semibold px-8 py-4 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2"
            variants={itemVariants}
            onClick={handleNavigate}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            Start Sharing Now
            <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        </motion.div>

        {/* Right Car Image */}
        <motion.div
          className="flex-1"
          initial="hidden"
          animate="visible"
          variants={imageVariants}
        >
          <div className="relative">
            <img
              src="/car2.png"
              alt="Carpool or Ride Sharing"
              className="w-full h-auto max-w-lg mx-auto rounded-xl shadow-2xl border-8 border-white transform rotate-1 hover:rotate-0 transition-transform duration-500"
            />
            <div className="absolute -bottom-6 -right-1 bg-white p-4 rounded-xl shadow-lg z-10">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FaGasPump className="text-blue-600 text-xl" />
                </div>
                <p className="font-semibold text-gray-800">70% cheaper</p>
              </div>
            </div>
            <div className="absolute -top-6 -left-1 bg-white p-4 rounded-xl shadow-lg z-10">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FaUserFriends className="text-blue-600 text-xl" />
                </div>
                <p className="font-semibold text-gray-800">4+ happy riders</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CheapestJourneyHero;
