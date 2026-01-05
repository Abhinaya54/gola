// Placeholder for ProtectedRoute component
import React from "react";
import { Navigate } from "react-router-dom";

// Dummy authentication check (replace with real logic)
const isAuthenticated = () => {
  // TODO: Replace with actual authentication logic
  return true;
};

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
