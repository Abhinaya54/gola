import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import StaffHome from "./pages/staff/Staffdashboard";
import SupervisorHome from "./pages/supervisor/Supervisordashboard";
import GovernmentHome from "./pages/government/Governmentdashboard";
import VoiceNotepad from "./pages/staff/VoiceNotepad";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route
          path="/*"
          element={
            <>
              <Routes>
                <Route path="staff" element={<VoiceNotepad />} />
                <Route path="staff/voice-notepad" element={<VoiceNotepad />} />
                <Route path="staff/dashboard" element={<StaffHome />} />
                <Route path="staff/*" element={<StaffHome />} />
                <Route path="supervisor/*" element={<SupervisorHome />} />
                <Route path="government/*" element={<GovernmentHome />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;