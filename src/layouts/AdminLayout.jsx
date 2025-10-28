import React, { useState,useEffect } from 'react';
import { Outlet,useLocation  } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminTopbar from '../components/AdminTopbar';
import ScrollToTop from '../utils/ScrollToTop';

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

   useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

 

  const sidebarWidth = collapsed ? 80 : 256;

  return (
    <>
      <ScrollToTop />
    <div className="flex min-h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div
        className="hidden lg:block fixed top-0 left-0 h-full bg-white shadow-lg z-50 overflow-y-auto"
        style={{ width: sidebarWidth }}
      >
        <AdminSidebar collapsed={collapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-30 lg:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-lg z-50 overflow-y-auto">
            <AdminSidebar collapsed={false} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
          </div>
        </div>
      )}

      {/* Main Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          collapsed ? "lg:ml-[80px]" : "lg:ml-[256px]"
        }`}
      >
        {/* Topbar */}
        <AdminTopbar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        {/* Main Content */}
        <main
          className="flex-1 pt-16 px-4 pb-6 overflow-y-auto"
          onClick={() => mobileOpen && setMobileOpen(false)}
        >
          <div className="w-full max-w-8xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
    </>
  );
};


export default AdminLayout
