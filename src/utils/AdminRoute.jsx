// src/utils/AdminProtectedRoute.js
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const adminToken = localStorage.getItem("admintoken");
  const location = useLocation();

  if (!adminToken) {
    // Redirect to login but remember where they came from
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminProtectedRoute;