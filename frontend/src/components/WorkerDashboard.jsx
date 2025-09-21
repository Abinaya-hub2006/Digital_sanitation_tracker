// src/dashboard/WorkerDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function WorkerDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [activeTab, setActiveTab] = useState("assigned"); // default
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // Fetch complaints
  const fetchComplaints = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/worker/complaints", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplaints(res.data);
    } catch (err) {
      console.error("❌ Error fetching complaints:", err);
    }
  };

  const updateStatus = async (complaintId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/worker/complaints/${complaintId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchComplaints();
    } catch (err) {
      console.error("❌ Error updating complaint status:", err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const filteredComplaints = complaints.filter((c) => {
    if (activeTab === "assigned") return c.status === "assigned";
    if (activeTab === "finished") return c.status === "finished";
    return true;
  });

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">👷 Sanitation Worker — {user?.username}</h1>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/";
          }}
          className="logout-btn"
        >
          🚪 Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {["assigned", "finished"].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Complaints
          </button>
        ))}
      </div>

      {/* Complaints */}
      <div className="complaints-list">
        {filteredComplaints.length === 0 ? (
          <p className="empty-text">No {activeTab} complaints</p>
        ) : (
          filteredComplaints.map((c) => (
            <div key={c.id} className="complaint-card">
              <h3 className="complaint-title">{c.issue}</h3>
              <p>
                <span className={`status-badge ${c.status.toLowerCase()}`}>
                  {c.status}
                </span>{" "}
                • 🏫 {c.school_name}
              </p>
              <p className="complaint-footer">
                Reported on {new Date(c.created_at).toLocaleString()}
              </p>

              {c.status !== "finished" && (
                <button
                  onClick={() => updateStatus(c.id, "finished")}
                  className="finish-btn"
                >
                  ✅ Mark as Finished
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* CSS */}
      <style>{`
        .dashboard-container {
          background: linear-gradient(to bottom right, #e6f0ff, #f8fbff);
          min-height: 100vh;
          padding: 2rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .dashboard-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1e40af;
        }
        .logout-btn {
          background: #dc2626;
          color: white;
          padding: 0.6rem 1.2rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.2s ease-in-out;
        }
        .logout-btn:hover {
          background: #b91c1c;
        }
        .tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .tab-btn {
          flex: 1;
          padding: 0.9rem;
          border: none;
          border-radius: 8px;
          background: #e5e7eb;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s ease-in-out;
        }
        .tab-btn.active {
          background: #2563eb;
          color: white;
          transform: scale(1.02);
        }
        .complaints-list {
          display: grid;
          gap: 1rem;
        }
        .complaint-card {
          background: white;
          padding: 1.2rem;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 3px 8px rgba(0,0,0,0.08);
          transition: transform 0.2s ease;
        }
        .complaint-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 14px rgba(0,0,0,0.12);
        }
        .complaint-title {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #111827;
        }
        .status-badge {
          padding: 0.3rem 0.7rem;
          border-radius: 6px;
          color: white;
          font-size: 0.9rem;
          text-transform: capitalize;
          font-weight: 500;
        }
        .status-badge.assigned { background: #3b82f6; }
        .status-badge.finished { background: #16a34a; }
        .complaint-footer {
          font-size: 0.9rem;
          color: #6b7280;
          margin-top: 0.5rem;
        }
        .finish-btn {
          margin-top: 0.8rem;
          padding: 0.7rem 1.2rem;
          background: #16a34a;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.2s;
        }
        .finish-btn:hover {
          background: #15803d;
        }
      `}</style>
    </div>
  );
}
