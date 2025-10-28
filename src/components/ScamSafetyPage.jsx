import React from 'react';
import { motion } from 'framer-motion';
import {
  MdLock,
  MdVerifiedUser,
  MdLocationOn,
  MdStarRate,
} from 'react-icons/md';

const features = [
  {
    icon: <MdLock />,
    title: 'Secure Payments',
    description: 'Multiple safe payment options to protect your data',
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    icon: <MdVerifiedUser />,
    title: 'Verified Drivers',
    description: 'All drivers are background-checked for your safety',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    icon: <MdLocationOn />,
    title: 'Live Tracking',
    description: 'Track your driver in real-time from booking to pickup',
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    icon: <MdStarRate />,
    title: 'Ratings & Reviews',
    description: 'Rate your ride to help maintain high-quality service',
    bgColor: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
  },
];

const SafetyFeatures = () => {
  return (
    <section className="px-2 py-6">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Your Safety Comes First
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We've built multiple layers of protection into every ride
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className={`h-full p-2 md:p-6 rounded-2xl ${feature.bgColor} transition-all duration-300 group-hover:shadow-xl`}>
                <div className={`text-5xl mb-6 ${feature.iconColor} transition-transform duration-300 group-hover:scale-110`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
                <div className="mt-6">
                  <div className="w-12 h-1 bg-gray-300 group-hover:bg-gray-900 transition-colors duration-300"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SafetyFeatures;
