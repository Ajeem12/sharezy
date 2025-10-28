// components/ProtectedRoute.jsx
import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import SharezyLoader from "../components/SharezyLoader";

const ProtectedRoute = ({ children }) => {
  const { token, isInitializing } = useAuth();
  const location = useLocation();
 
 
  if (isInitializing) {
    return <SharezyLoader />; // Show loading spinner
  }

  if (!token) {
   
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;