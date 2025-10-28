import { FaCar, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaStar, FaExchangeAlt, FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';
const HowItWorks = () => {
  const steps = [
    {
      icon: <FaMapMarkerAlt className="text-3xl text-blue-500" />,
      title: "Set Your Route",
      description: "Enter your pickup and drop-off locations"
    },
    {
      icon: <FaCar className="text-3xl text-blue-500" />,
      title: "Choose Your Ride",
      description: "Select from available vehicles and drivers"
    },
    {
      icon: <FaUser className="text-3xl text-blue-500" />,
      title: "Meet Your Driver",
      description: "Get matched with verified community drivers"
    },
    {
      icon: <FaStar className="text-3xl text-blue-500" />,
      title: "Enjoy Your Ride",
      description: "Travel comfortably with trusted companions"
    }
  ];

  return (
    <section className="py-6  bg-white">
      <div className="container mx-auto p-2">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">How Sharezy Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get where you need to go in just a few simple steps
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-50 p-2 rounded-xl text-center hover:shadow-lg transition-shadow"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default HowItWorks;