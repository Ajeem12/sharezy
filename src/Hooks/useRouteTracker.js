// useRouteTracker.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useRouteTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname + location.search;

    // Ignore auth routes
    const ignoredPaths = ["/login", "/verify", "/signup"];
    const isIgnored = ignoredPaths.some((p) => path.startsWith(p));

    if (!isIgnored) {
      localStorage.setItem("lastVisitedPath", path);
      
    }
  }, [location]);
};

export default useRouteTracker;
