import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-20 bg-blue-500">
      <div className="container mx-auto px-2 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Ride Smarter?
          </h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Join thousands of riders saving money and reducing their carbon
            footprint
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/signup"
              className="bg-gray-900 text-white hover:bg-gray-800 font-bold py-4 px-8 rounded-lg transition shadow-lg"
            >
              Sign Up Now
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
