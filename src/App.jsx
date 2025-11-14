import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import VerifyOtp from "./pages/VerifyOtp";
import RideListingPage from "./pages/RideListingPage";
import Details from "./pages/Details";
import Search from "./pages/Search";
import Publish from "./pages/Publish";
import ProfileDashboard from "./layouts/ProfileDashboard";
import ProfileContent from "./pages/profile/ProfileContent";
import Setting from "./pages/profile/Setting";
import MyRides from "./pages/profile/MyRides";
import UserBookingsCards from "./pages/profile/Booking";
import PaymentSuccess from "./pages/PaymentSuccess";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./layouts/AdminLayout";
import UserManagement from "./pages/admin/UserManagement";
import UserRideDetails from "./pages/admin/UserRideDetails";
import Support from "./pages/admin/Support";
import SharezyLoader from "./components/SharezyLoader";
import AdminLogin from "./pages/admin/AdminLogin";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute";
import PublicRoute from "./utils/PublicRoute";
import { Toaster } from "sonner";
import RideRequestDetails from "./pages/profile/RideRequestDetails";
import TotalRides from "./pages/admin/TotalRides";
import AdminProtectedRoute from "./utils/AdminRoute";
import PrivateRoute from "./utils/PrivateRoute";
import ReportDetailsPage from "./pages/admin/Support";
import EditRideForm from "./pages/profile/EditRideForm";
import UserReport from "./pages/admin/UserReport";
import CommissionComponent from "./pages/admin/Commission";
import CommissionReportComponent from "./pages/profile/CommissionReport";
import Kyc from "./pages/profile/Kyc";
import KycInfo from "./pages/profile/KycInfo";
import Wallet from "./pages/profile/Wallet";
import Adminkyclist from "./pages/admin/Adminkyclist";
import KycDetail from "./pages/admin/KycDetail";
import KycCondition from "./pages/profile/KycCondition";
import KycEdit from "./pages/profile/KycEdit";
import TermsNConditions from "./pages/TermsNConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import Contact from "./pages/Contact";
import About from "./pages/About";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      {
        path: "/login",
        element: (
          <PublicRoute>
            {" "}
            <Login />{" "}
          </PublicRoute>
        ),
      },
      {
        path: "/verify",
        element: (
          <PublicRoute>
            {" "}
            <VerifyOtp />{" "}
          </PublicRoute>
        ),
      },
      { path: "/signup", element: <Register /> },
      { path: "/rides", element: <RideListingPage /> },
      { path: "/details/:rideId", element: <Details /> },
      { path: "/search", element: <Search /> },
      { path: "/terms-and-conditions", element: <TermsNConditions /> },
      { path: "/privacy-policy", element: <PrivacyPolicy /> },
      { path: "/refund-policy", element: <RefundPolicy /> },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/publish",
        element: (
          <PrivateRoute>
            <Publish />
          </PrivateRoute>
        ),
      },
      { path: "/loader", element: <SharezyLoader /> },
      { path: "/thank-you/:id", element: <PaymentSuccess /> },
      // In your router configuration
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <ProfileDashboard />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="profile" replace />,
          },
          { path: "profile", element: <ProfileContent /> },
          { path: "settings", element: <Setting /> },
          { path: "myrides", element: <MyRides /> },
          { path: "booked", element: <UserBookingsCards /> },
          { path: "commissionreport", element: <CommissionReportComponent /> },
          { path: "edit-ride/:rideId", element: <EditRideForm /> },
          { path: "kyc", element: <KycCondition /> },
          { path: "kyc-edit", element: <KycEdit /> },
          { path: "wallet", element: <Wallet /> },

          {
            path: "/dashboard/profile/my-rides/:rideId/requests/:requestId",
            element: <RideRequestDetails />,
          },
        ],
      },
    ],
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "admin",
    element: (
      <AdminProtectedRoute>
        <AdminLayout />
      </AdminProtectedRoute>
    ),
    children: [
      { path: "", element: <AdminDashboard /> },
      { path: "userlist", element: <UserManagement /> },
      { path: "user/:userId", element: <UserRideDetails /> },
      { path: "user/:userId/reports", element: <ReportDetailsPage /> },
      { path: "allrides", element: <TotalRides /> },
      { path: "support", element: <UserReport /> },
      { path: "commission", element: <CommissionComponent /> },
      { path: "kyclist", element: <Adminkyclist /> },
      { path: "kycdetail/:id", element: <KycDetail /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default function AppRouter() {
  return (
    <>
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          style: {
            borderRadius: "12px",
            padding: "16px 24px",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
            maxWidth: "380px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(4px)",
            background: "rgba(255, 255, 255, 0.95)",
          },
          success: {
            iconTheme: {
              primary: "#10b981", // Tailwind emerald-500
              secondary: "#d1fae5", // Tailwind emerald-100
            },
            style: {
              borderLeft: "4px solid #10b981",
            },
            duration: 4000,
          },
          error: {
            iconTheme: {
              primary: "#ef4444", // Tailwind red-500
              secondary: "#fee2e2", // Tailwind red-100
            },
            style: {
              borderLeft: "4px solid #ef4444",
            },
            duration: 6000,
          },
          loading: {
            iconTheme: {
              primary: "#3b82f6", // Tailwind blue-500
              secondary: "#dbeafe", // Tailwind blue-100
            },
            style: {
              borderLeft: "4px solid #3b82f6",
            },
          },
          blank: {
            style: {
              borderLeft: "4px solid #64748b", // Tailwind slate-500
            },
          },
        }}
      />

      <RouterProvider router={router} />
    </>
  );
}
