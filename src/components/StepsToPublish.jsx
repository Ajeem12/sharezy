import React from "react";
import { FaClock, FaRocket, FaThumbsUp } from "react-icons/fa";
import { motion } from "framer-motion";

const stepsData = [
  {
    icon: <FaClock size={32} className="text-blue-500" />,
    title: "Quick Setup",
    description: "Fill in your ride details easily and quickly in just a few simple steps.",
    delay: 0.1
  },
  {
    icon: <FaRocket size={32} className="text-blue-500" />,
    title: "Instant Publish",
    description: "Your ride goes live immediately for passengers to find and book.",
    delay: 0.2
  },
  {
    icon: <FaThumbsUp size={32} className="text-blue-500" />,
    title: "Manage Easily",
    description: "Update, modify or remove rides anytime through your dashboard.",
    delay: 0.3
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const StepsToPublish = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.1 }}
        className="text-center mb-12"
      >
        <motion.h2 
          variants={fadeInUp}
          className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
        >
          Publish Your Ride in Minutes
        </motion.h2>
        <motion.p 
          variants={fadeInUp}
          className="text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Getting your ride listed is quick and effortless with our simple process.
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stepsData.map(({ icon, title, description, delay }, index) => (
          <motion.div
            key={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.5, delay }}
            className="group"
          >
            <div className="bg-white rounded-xl shadow-lg p-8 h-full flex flex-col items-center text-center transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2">
              <div className="mb-5 p-4 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors">
                {icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
              <p className="text-gray-600 leading-relaxed">{description}</p>
              <div className="mt-4 text-blue-500 font-medium text-sm">
                Step {index + 1}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 }}
        className="mt-16 text-center"
      >
       
      </motion.div>
    </section>
  );
};

export default StepsToPublish;