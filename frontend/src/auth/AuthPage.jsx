import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [tab, setTab] = useState("login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "school", // default for self-register
  });

  const navigate = useNavigate();

  // ✅ Safe JSON.parse (avoids crash when no user is stored yet)
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch (e) {
    user = null;
  }

  console.log("🔎 AuthPage loaded. Current user:", user);

  const isAdmin = user?.role_id === 1;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    if (tab === "login") {
      // Login
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username: formData.username,
        password: formData.password,
      });

      console.log("🔎 Login response:", res.data);

      const { token, user } = res.data;

      if (!user || !user.role_id) {
        alert("Login failed: " + (res.data.error || "Invalid response"));
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      const roleId = Number(user.role_id);

      if (roleId === 1) {
        navigate("/admin-dashboard");
      } else if (roleId === 2) {
        navigate("/school-dashboard");
      } else if (roleId === 4) {
        navigate("/worker-dashboard");
      } else {
        alert("Unknown role: " + roleId);
      }
    } else {
      // Registration
      const config = {};
      if (formData.role === "worker") {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("You must be logged in as Admin to create a worker.");
          return;
        }
        config.headers = { Authorization: `Bearer ${token}` };
      }

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          username: formData.username,
          password: formData.password,
          role: formData.role,
        },
        config
      );

      alert(res.data.message || "Registration successful! You can now log in.");
      setTab("login");
    }
  } catch (err) {
    console.error("Auth error:", err.response?.data || err.message);
    alert("Error: " + (err.response?.data?.error || err.message));
  }
};


  // --- Styling ---
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(to right, #4facfe, #00f2fe)",
    fontFamily: "Arial, sans-serif",
  };

  const boxStyle = {
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
    width: "350px",
    textAlign: "center",
    boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
  };

  const tabStyle = (active) => ({
    padding: "10px 20px",
    cursor: "pointer",
    fontWeight: active ? "bold" : "normal",
    borderBottom: active ? "2px solid #007bff" : "2px solid transparent",
    color: active ? "#007bff" : "#333",
    flex: 1,
  });

  const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "5px",
  };

  const buttonStyle = {
    width: "100%",
    padding: "10px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  };

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        {/* Tabs */}
        <div style={{ display: "flex", marginBottom: "20px" }}>
          <div style={tabStyle(tab === "login")} onClick={() => setTab("login")}>
            Login
          </div>
          <div
            style={tabStyle(tab === "register")}
            onClick={() => setTab("register")}
          >
            Register
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <input
            style={inputStyle}
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            style={inputStyle}
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {tab === "register" && (
            <select
              style={inputStyle}
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="school">School</option>
              {isAdmin && <option value="worker">Worker</option>}
            </select>
          )}

          <button type="submit" style={buttonStyle}>
            {tab === "login" ? "Login" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
