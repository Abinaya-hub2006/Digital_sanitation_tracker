import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Analytics({ complaints }) {
  // Complaints per school
  const perSchool = complaints.reduce((acc, c) => {
    acc[c.school_name] = (acc[c.school_name] || 0) + 1;
    return acc;
  }, {});
  const schoolData = Object.entries(perSchool).map(([name, count]) => ({ name, count }));

  // Complaints by status
  const perStatus = complaints.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});
  const statusData = Object.entries(perStatus).map(([name, value]) => ({ name, value }));

  const COLORS = ["#3b82f6", "#16a34a", "#f59e0b"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
      {/* Complaints per School */}
      <div className="bg-white p-4 rounded-lg shadow border border-blue-200">
        <h2 className="text-lg font-bold text-blue-900 mb-3">Complaints per School</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={schoolData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Complaints by Status */}
      <div className="bg-white p-4 rounded-lg shadow border border-blue-200">
        <h2 className="text-lg font-bold text-blue-900 mb-3">Complaints by Status</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={statusData} dataKey="value" label>
              {statusData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
