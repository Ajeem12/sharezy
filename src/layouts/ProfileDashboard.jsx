// layouts/ProfileDashboard.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Footer from '../components/common/Footer';
import ScrollToTop from '../utils/ScrollToTop';

const ProfileDashboard = () => {
  return (
    <>
      <ScrollToTop />
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex flex-1 w-full max-w-7xl mx-auto">
        <Sidebar />
        <main className="flex-1 md:p-6 p-0">
          <Outlet />
        </main>
      </div>
     <div className="hidden md:block">
  <Footer />
</div>

    </div>
    </>
  )
};

export default ProfileDashboard;
