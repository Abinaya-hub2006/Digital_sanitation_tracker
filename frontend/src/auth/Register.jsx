import React, { useState } from "react";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      setMsg("✅ Registration successful. Please login.");
    } catch (err) {
      setMsg("❌ Registration failed.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="app-title">🧼 Sanitation Tracker</h1>
        <h2 className="auth-title">Register</h2>

        {msg && <p className="info-text">{msg}</p>}

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
          <button type="submit">Register</button>
        </form>

        <p className="switch-text">
          Already have an account? <a href="/">Login</a>
        </p>
      </div>

      <style>{`
        .auth-container {
          background: linear-gradient(to bottom right, #fdf2f8, #f8fafc);
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
          color: #be185d;
          margin-bottom: 1rem;
        }
        .auth-title {
          font-size: 1.4rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #db2777;
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
          background: #db2777;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        button:hover {
          background: #9d174d;
        }
        .switch-text {
          margin-top: 1rem;
          font-size: 0.9rem;
        }
        .switch-text a {
          color: #db2777;
          text-decoration: none;
          font-weight: 600;
        }
        .info-text {
          font-size: 0.9rem;
          margin-bottom: 1rem;
          color: #374151;
        }
      `}</style>
    </div>
  );
}
