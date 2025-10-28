import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import MobileMenuBar from '../components/common/MobileMenuBar';
import { Outlet, useLocation } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import ScrollToTop from '../utils/ScrollToTop';
import useRouteTracker from '../Hooks/useRouteTracker';



const MainLayout = () => {
  useRouteTracker();
  const location = useLocation();
  const isMobile = useMediaQuery({ maxWidth: 1024 });
  
  // Define routes where mobile menu should be hidden
  const hideMobileMenuRoutes = [
    '/profile',
    '/dashboard',
    '/settings'
    // Add any other routes where you want to hide the mobile menu
  ];
  
  // Check if current route should hide mobile menu
  const shouldHideMobileMenu = hideMobileMenuRoutes.some(route => 
    location.pathname.startsWith(route)
  );

  // Check if current route is dashboard
  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  return (
    <>
      <ScrollToTop />
      <Navbar />
     
      <main className=" lg:pb-0">
        <Outlet />
      </main>
      
      {/* Show standard footer on desktop */}
      {!isMobile && !isDashboardRoute && <Footer />}

      {/* Show mobile menu bar only on mobile and not on hidden routes */}
      {isMobile && !shouldHideMobileMenu && <MobileMenuBar />}
    </>
  );
};

export default MainLayout;