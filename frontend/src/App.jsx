import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Sidebar from "./components/common/Sidebar";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import StaffHome from "./pages/staff/Staffdashboard";
import SupervisorHome from "./pages/supervisor/Supervisordashboard";
import GovernmentHome from "./pages/government/Governmentdashboard";
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes with Navbar/Sidebar */}
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <Sidebar />
              <Routes>
                <Route path="staff/*" element={<ProtectedRoute role="staff"><StaffHome /></ProtectedRoute>} />
                <Route path="supervisor/*" element={<ProtectedRoute role="supervisor"><SupervisorHome /></ProtectedRoute>} />
                <Route path="government/*" element={<ProtectedRoute role="government"><GovernmentHome /></ProtectedRoute>} />
              </Routes>
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;