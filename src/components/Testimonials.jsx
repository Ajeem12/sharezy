import { motion } from "framer-motion";
import { FaStar } from 'react-icons/fa';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "Sharezy saved me hundreds on my daily commute while meeting great people along the way!",
      author: "Sarah J.",
      rating: 5
    },
    {
      quote: "The premium option feels like a private chauffeur service at half the price.",
      author: "Michael T.",
      rating: 5
    },
    {
      quote: "I've made new friends while sharing rides to work. Highly recommend!",
      author: "Priya K.",
      rating: 4
    }
  ];

  return (
    <section className="py-6 bg-white px-2 ">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            What Our Riders Say
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of happy riders sharing their journeys.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="bg-gray-50 p-6 rounded-2xl shadow hover:shadow-md transition duration-300"
            >
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`h-5 w-5 ${i < testimonial.rating ? 'text-blue-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <p className="text-gray-800 text-[12px] md:text-lg italic mb-4">"{testimonial.quote}"</p>
              <p className="text-gray-900 font-semibold text-sm md:text-base">— {testimonial.author}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
