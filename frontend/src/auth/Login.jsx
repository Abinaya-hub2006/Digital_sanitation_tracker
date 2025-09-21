import React, { useState } from "react";
import axios from "axios";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role_id === 1) window.location.href = "/admin";
      else if (res.data.user.role_id === 2) window.location.href = "/school";
      else if (res.data.user.role_id === 4) window.location.href = "/worker";
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="app-title">🧼 Sanitation Tracker</h1>
        <h2 className="auth-title">Login</h2>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>

        <p className="switch-text">
          Don’t have an account? <a href="/register">Register</a>
        </p>
      </div>

      <style>{`
        .auth-container {
          background: linear-gradient(to bottom right, #e0f2fe, #f8fafc);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: 'Segoe UI', Tahoma, sans-serif;
        }
        .auth-card {
          background: white;
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 6px 20px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 380px;
          text-align: center;
        }
        .app-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1e3a8a;
          margin-bottom: 1rem;
        }
        .auth-title {
          font-size: 1.4rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #2563eb;
        }
        form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        input {
          padding: 0.8rem;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          font-size: 1rem;
        }
        button {
          padding: 0.8rem;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        button:hover {
          background: #1e40af;
        }
        .switch-text {
          margin-top: 1rem;
          font-size: 0.9rem;
        }
        .switch-text a {
          color: #2563eb;
          text-decoration: none;
          font-weight: 600;
        }
        .error-text {
          color: #dc2626;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
}
