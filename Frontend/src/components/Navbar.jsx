import React from 'react';
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="sticky top-0 z-50 w-full">
      {/* Official Saffron/Gold Top Border & National Banner */}
      <div className="border-t-4 border-[#D97706] bg-[#F8FAFC] py-1.5 px-6 border-b border-[#E2E8F0] text-center text-xs font-semibold text-[#0F172A] flex items-center justify-center gap-2">
        <span>🇮🇳</span>
        <span>GOVERNMENT OF INDIA INITIATIVE</span>
        <span className="text-slate-400">|</span>
        <span className="text-[#D97706]">SMART INDIA HACKATHON</span>
      </div>

      <nav className="border-b border-slate-200 bg-[#0F172A] text-white py-4 px-6 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          
          <Link to="/" className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Aid<span className="text-[#D97706]">Nexus</span>
            <span className="text-[10px] uppercase font-semibold bg-[#D97706] text-white px-2 py-0.5 rounded-[4px] tracking-wider">
              Portal
            </span>
          </Link>

          <div className="hidden gap-6 md:flex text-sm">
            <Link to="/" className="text-slate-200 hover:text-[#D97706] font-semibold transition-all">
              Home
            </Link>
            <Link to="/citizen" className="text-slate-300 hover:text-[#D97706] font-medium transition-all">
              Citizen Dashboard
            </Link>
            <Link to="/student" className="text-slate-300 hover:text-[#D97706] font-medium transition-all">
              Student Dashboard
            </Link>
            <Link to="/industry" className="text-slate-300 hover:text-[#D97706] font-medium transition-all">
              Industry Dashboard
            </Link>
            <Link to="/admin" className="text-slate-300 hover:text-[#D97706] font-medium transition-all">
              Admin Dashboard
            </Link>
          </div>

          <div className="flex gap-3">
            <Link
              to="/login"
              className="rounded-[4px] border border-slate-700 bg-[#1E293B] px-4 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-all"
            >
              LOG IN
            </Link>

            <Link
              to="/register"
              className="rounded-[4px] bg-[#D97706] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#B45309] shadow-sm transition-all"
            >
              REGISTER
            </Link>
          </div>

        </div>
      </nav>
    </div>
  );
}