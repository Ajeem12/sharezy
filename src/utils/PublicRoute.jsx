import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PublicRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  // Check if there's a 'from' state (originally intended page)
  const from = location.state?.from || "/";

  if (user) {
    // Redirect logged in users to original page or home
    return <Navigate to={from} replace />;
  }

  // User not logged in, allow access to public routes
  return children;
}

export default PublicRoute;
