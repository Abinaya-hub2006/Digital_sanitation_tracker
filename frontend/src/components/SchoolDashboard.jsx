import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SchoolDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState({ school_name: "", designation: "", issue: "" });

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const fetchComplaints = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/complaints", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplaints(res.data);
    } catch (err) {
      console.error("❌ Error fetching complaints:", err);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/complaints", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ school_name: "", designation: "", issue: "" });
      fetchComplaints();
    } catch (err) {
      console.error("❌ Error submitting complaint:", err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">🏫 School Dashboard — {user?.username}</h1>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
          className="logout-btn"
        >
          🚪 Logout
        </button>
      </div>

      <h2 className="section-title">✏️ Submit Complaint</h2>
      <form className="complaint-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="school_name"
          placeholder="School Name"
          value={form.school_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="designation"
          placeholder="Your Role (e.g. Teacher, Student)"
          value={form.designation}
          onChange={handleChange}
          required
        />
        <textarea
          name="issue"
          placeholder="Describe the issue"
          value={form.issue}
          onChange={handleChange}
          required
        />
        <button type="submit">📤 Submit</button>
      </form>

      <h2 className="section-title">📋 My Complaints</h2>
      <div className="complaints-list">
        {complaints.length === 0 ? (
          <p className="empty-text">No complaints submitted yet</p>
        ) : (
          complaints.map((c) => (
            <div key={c.id} className="complaint-card">
              <h3>{c.issue}</h3>
              <p>
                <span className={`status-badge ${c.status.toLowerCase()}`}>
                  {c.status}
                </span>{" "}
                • {c.designation}
              </p>
              <p className="complaint-footer">
                Submitted on {new Date(c.created_at).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>

      <style>{`
        .dashboard-container {
          background: #f9fafb;
          min-height: 100vh;
          padding: 2rem;
          font-family: 'Segoe UI', sans-serif;
        }
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .dashboard-title {
          font-size: 1.6rem;
          font-weight: 700;
          color: #065f46;
        }
        .logout-btn {
          background: #dc2626;
          color: white;
          padding: 0.6rem 1rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }
        .section-title {
          margin-top: 1rem;
          margin-bottom: 0.8rem;
          font-size: 1.2rem;
          font-weight: 600;
          color: #047857;
        }
        .complaint-form {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          margin-bottom: 1.5rem;
        }
        input, textarea {
          padding: 0.8rem;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          font-size: 1rem;
        }
        textarea {
          min-height: 80px;
        }
        button {
          padding: 0.8rem;
          background: #059669;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        button:hover {
          background: #065f46;
        }
        .complaints-list {
          display: grid;
          gap: 1rem;
        }
        .complaint-card {
          background: white;
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid #ddd;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        .status-badge {
          padding: 0.2rem 0.6rem;
          border-radius: 6px;
          color: white;
          font-size: 0.85rem;
        }
        .status-badge.pending { background: #f59e0b; }
        .status-badge.assigned { background: #3b82f6; }
        .status-badge.finished { background: #16a34a; }
        .complaint-footer {
          font-size: 0.9rem;
          color: #555;
          margin-top: 0.3rem;
        }
      `}</style>
    </div>
  );
}
