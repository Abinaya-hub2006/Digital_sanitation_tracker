import React, { useState, useEffect } from "react";
import axios from "axios";
import Analytics from "./Analytics";

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState("complaints");
  const [complaints, setComplaints] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [workerUsername, setWorkerUsername] = useState("");
  const [workerPassword, setWorkerPassword] = useState("");
  const [filter, setFilter] = useState("pending");
  const [showCreateWorker, setShowCreateWorker] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const fetchComplaints = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/complaints", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWorkers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/workers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWorkers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createWorker = async () => {
    if (!workerUsername || !workerPassword) return alert("Fill all fields");
    try {
      await axios.post(
        "http://localhost:5000/api/admin/workers",
        { username: workerUsername, password: workerPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Worker created ✅");
      setWorkerUsername("");
      setWorkerPassword("");
      fetchWorkers();
      setShowCreateWorker(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create worker ❌");
    }
  };

  useEffect(() => {
    fetchComplaints();
    fetchWorkers();
  }, []);

  // Inline styles
  const styles = {
    container: { display: "flex", minHeight: "100vh", backgroundColor: "#e0f2fe" },
    sidebar: {
      width: "260px",
      backgroundColor: "#1e40af",
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      padding: "24px",
    },
    sidebarItem: (active) => ({
      padding: "12px 16px",
      marginBottom: "8px",
      cursor: "pointer",
      borderRadius: "8px",
      backgroundColor: active ? "#2563eb" : "transparent",
      fontWeight: active ? "bold" : "normal",
    }),
    createWorkerContainer: {
      marginTop: "16px",
      backgroundColor: "#3b82f6",
      padding: "12px",
      borderRadius: "8px",
    },
    input: {
      width: "100%",
      padding: "8px",
      marginBottom: "8px",
      borderRadius: "6px",
      border: "1px solid #93c5fd",
      outline: "none",
    },
    button: {
      width: "100%",
      padding: "10px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      fontWeight: "bold",
      backgroundColor: "#2563eb",
      color: "#fff",
    },
    main: { flex: 1, padding: "24px" },
    header: { fontSize: "28px", fontWeight: "bold", color: "#1e3a8a", marginBottom: "24px" },
    filterButton: (active) => ({
      padding: "8px 16px",
      borderRadius: "8px",
      fontWeight: "500",
      cursor: "pointer",
      marginRight: "8px",
      border: active ? "none" : "1px solid #1e40af",
      backgroundColor: active ? "#1e40af" : "#bfdbfe",
      color: active ? "#fff" : "#1e40af",
    }),
    complaintsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" },
    complaintCard: {
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "16px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
      border: "1px solid #bfdbfe",
      marginBottom: "16px",
    },
    issue: { fontSize: "18px", fontWeight: "600", color: "#1e40af" },
    info: { color: "#1e3a8a", marginTop: "4px" },
    status: { fontWeight: "bold", padding: "4px 8px", borderRadius: "12px", backgroundColor: "#1e40af", color: "#fff" },
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarItem(activePage === "complaints")} onClick={() => setActivePage("complaints")}>
          📝 Complaints
        </div>
        <div style={styles.sidebarItem(activePage === "analytics")} onClick={() => setActivePage("analytics")}>
          📊 Analytics
        </div>

        {/* Collapsible Create Worker */}
        <div style={styles.createWorkerContainer}>
          <div
            style={{ cursor: "pointer", fontWeight: "bold", marginBottom: "8px" }}
            onClick={() => setShowCreateWorker(!showCreateWorker)}
          >
            👷 Create Worker {showCreateWorker ? "▲" : "▼"}
          </div>
          {showCreateWorker && (
            <div>
              <input
                type="text"
                placeholder="Username"
                value={workerUsername}
                onChange={(e) => setWorkerUsername(e.target.value)}
                style={styles.input}
              />
              <input
                type="password"
                placeholder="Password"
                value={workerPassword}
                onChange={(e) => setWorkerPassword(e.target.value)}
                style={styles.input}
              />
              <button onClick={createWorker} style={styles.button}>
                ➕ Add Worker
              </button>
            </div>
          )}
        </div>

        <div
          style={{ marginTop: "auto", cursor: "pointer", fontWeight: "bold", padding: "12px 16px", borderRadius: "8px", backgroundColor: "#2563eb", textAlign: "center" }}
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          🚪 Logout
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        <h1 style={styles.header}>🛠️ Admin Dashboard — {user?.username}</h1>

        {activePage === "complaints" && (
          <>
            {/* Status Filter */}
            <div style={{ marginBottom: "24px" }}>
              {["pending", "assigned", "finished"].map((status) => (
                <button key={status} onClick={() => setFilter(status)} style={styles.filterButton(filter === status)}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            {/* Complaints Grid */}
            <div style={styles.complaintsGrid}>
              {complaints
                .filter((c) => c.status.toLowerCase() === filter)
                .map((c) => (
                  <div key={c.id} style={styles.complaintCard}>
                    <p style={styles.issue}>{c.issue}</p>
                    <p style={styles.info}>
                      Reported by <b>{c.school_name}</b> ({c.designation})
                    </p>
                    <p style={styles.info}>Created: {new Date(c.created_at).toLocaleString()}</p>
                    <p style={{ marginTop: "8px" }}>
                      Status: <span style={styles.status}>{c.status}</span>
                    </p>
                  </div>
                ))}
            </div>
          </>
        )}

        {activePage === "analytics" && <Analytics complaints={complaints} />}
      </div>
    </div>
  );
}
