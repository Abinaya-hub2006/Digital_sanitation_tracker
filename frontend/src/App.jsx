import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AuthPage from "./auth/AuthPage";   // ✅ correct path
import AdminDashboard from "./components/AdminDashboard";
import SchoolDashboard from "./components/SchoolDashboard";
import WorkerDashboard from "./components/WorkerDashboard";
import Analytics from "./components/Analytics";
export default function App() {
  console.log("✅ App.jsx rendered");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/school-dashboard" element={<SchoolDashboard />} />
        <Route path="/worker-dashboard" element={<WorkerDashboard />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Router>
  );
}
