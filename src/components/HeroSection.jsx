import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCreative } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-creative';
import { motion } from 'framer-motion';
import RideForm from './RideForm';

const images = [
  '/car1.png',

];

const HeroSection = () => {
  return (
    <section className="relative w-full  overflow-hidden">
      {/* Gradient Overlay */}
      <div className="absolute inset-0  z-10" />

      {/* Background Swiper with Creative Effect */}
      <div className="absolute inset-0 z-0">
        <Swiper
          modules={[Autoplay, EffectCreative]}
          effect="creative"
          creativeEffect={{
            prev: {
              shadow: true,
              translate: [0, 0, -400],
            },
            next: {
              translate: ['100%', 0, 0],
            },
          }}
          speed={1200}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={true}
          grabCursor={false}
          className="w-full h-full"
        >
          {images.map((src, index) => (
            <SwiperSlide key={index}>
              <motion.img
                src={src}
                alt={`Slide ${index + 1}`}
                className="w-[100%] h-full  object-cover"
                loading="eager"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, ease: 'linear' }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Foreground Content */}
      <div className="relative z-20 flex items-center justify-center h-full px-4 py-12 md:py-20">
        <div className="text-center max-w-7xl mx-auto space-y-8">
          {/* Hero Heading with Staggered Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight drop-shadow-2xl">
              <span className="block">Ride With</span>
              <span className="text-primary-400">Comfort & Safety</span>
            </h1>
          </motion.div>

          {/* Subheading with Delayed Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          >
            <p className="text-white/90 text-lg sm:text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto drop-shadow-md">
              Book your perfect ride with our premium service. Travel in style with professional drivers and seamless experience.
            </p>
          </motion.div>

          {/* Ride Form with Spring Animation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: 'spring',
              stiffness: 100,
              damping: 15,
              delay: 0.6
            }}
            className=""
          >
            <RideForm />
          </motion.div>
        </div>
      </div>

      {/* Decorative Animated Elements */}

    </section>
  );
};

export default HeroSection;