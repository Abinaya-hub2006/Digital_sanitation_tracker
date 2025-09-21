import React from "react";

export default function Navigation({ user, onLogout }) {
  return (
    <div className="nav">
      <h1 className="nav-title">Admin Dashboard — {user?.username}</h1>
      <button className="logout-btn" onClick={onLogout}>🚪 Logout</button>

      {/* CSS */}
      <style>{`
        .nav { display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: #f1f5f9; margin-left: 220px; }
        .nav-title { font-size: 1.5rem; font-weight: bold; color: #1e3a8a; }
        .logout-btn { background: #dc2626; color: white; padding: 0.5rem 1rem; border: none; border-radius: 6px; cursor: pointer; }
      `}</style>
    </div>
  );
}
