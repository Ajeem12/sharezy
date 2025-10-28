import React, { useEffect, useState } from 'react';
import HeroSection from '../components/HeroSection'
import HowItWorks from '../components/HowItWorks'
import HelpCenter from '../components/HelpCenter'
import PopularRides from '../components/PopularRides'
import CheapestJourneyHero from '../components/CheapestJourneyHero'
import ScamSafetyPage from '../components/ScamSafetyPage'
import Testimonials from '../components/Testimonials'
import CTASection from '../components/Cta'
import SharezyLoader from '../components/SharezyLoader';

const Home = () => {
    const [isLoading, setIsLoading] = useState(true);

     useEffect(() => {
    // Simulate loading time for UX (e.g. fetching data, animations, etc.)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Adjust time as needed

    return () => clearTimeout(timer); // Cleanup
  }, []);

   if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-30">
        <SharezyLoader />
      </div>
    );
  }

  return (
    <>
  <HeroSection/>
  <HowItWorks/>
  <PopularRides/>
  <CheapestJourneyHero/>
  <ScamSafetyPage/>
  <Testimonials/>
  <CTASection/>
  <HelpCenter/>
   </>
  )
}

export default Home