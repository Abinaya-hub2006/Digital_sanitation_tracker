// src/auth/Logout.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear JWT / session
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // Redirect to login
    navigate("/login");
  }, [navigate]);

  return <p>Logging out...</p>;
}

export default Logout;
