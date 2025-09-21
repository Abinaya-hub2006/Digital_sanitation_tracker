import React, { useState } from "react";
import { MdMenu, MdAnalytics, MdList, MdLogout } from "react-icons/md";

export default function Sidebar({ onNavigate, onLogout }) {
  const [isOpen, setIsOpen] = useState(true);

  const navBtnStyle = `flex items-center gap-2 p-2 rounded-md transition-colors
    hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300`;

  return (
    <div
      className={`bg-blue-900 text-white min-h-screen transition-all duration-300 ${
        isOpen ? "w-52" : "w-16"
      }`}
    >
      <div className="flex justify-between items-center p-4">
        {isOpen && <span className="font-bold text-lg">Admin Panel</span>}
        <button onClick={() => setIsOpen(!isOpen)}>
          <MdMenu size={24} />
        </button>
      </div>

      <nav className="mt-4 flex flex-col gap-2">
        <button onClick={() => onNavigate("complaints")} className={navBtnStyle}>
          <MdList size={22} />
          {isOpen && "Complaints"}
        </button>

        <button onClick={() => onNavigate("analytics")} className={navBtnStyle}>
          <MdAnalytics size={22} />
          {isOpen && "Analytics"}
        </button>

        <button
          onClick={onLogout}
          className={`${navBtnStyle} mt-auto text-red-400 hover:bg-red-700`}
        >
          <MdLogout size={22} />
          {isOpen && "Logout"}
        </button>
      </nav>
    </div>
  );
}
