import React, { useState } from 'react';
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(() => {
    return sessionStorage.getItem("hideSIHBanner") !== "true";
  });

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 w-full shadow-md bg-[#0B2545]">
      {/* Top Banner: Official National Emblem & Initiative Info */}
      {showBanner && (
        <div className="bg-[#F1F5F9] py-2 px-6 border-b border-[#CCCCCC] text-xs font-semibold text-[#0B2545] flex items-center justify-between transition-all duration-300">
          <div className="flex items-center gap-2">
            <span>🇮🇳</span>
            <span className="tracking-wide text-[10px] sm:text-xs">GOVERNMENT OF INDIA INITIATIVE</span>
            <span className="text-slate-300">|</span>
            <span className="text-[#E65C00] font-bold tracking-wide text-[10px] sm:text-xs">SMART INDIA HACKATHON</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[11px] text-slate-500">
            <a href="https://www.sih.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-[#E65C00] transition-colors">SIH Website</a>
            <span>•</span>
            <a href="https://mygov.in" target="_blank" rel="noopener noreferrer" className="hover:text-[#E65C00] transition-colors">MyGov</a>
            <span>•</span>
            <span className="font-mono text-[10px] bg-slate-200/80 px-2 py-0.5 rounded text-slate-700">SIH-2026</span>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => {
                setShowBanner(false);
                sessionStorage.setItem("hideSIHBanner", "true");
              }}
              className="hover:text-red-600 transition-colors text-xs font-black cursor-pointer ml-1 select-none"
              title="Dismiss banner"
            >
              ✕
            </button>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => {
                setShowBanner(false);
                sessionStorage.setItem("hideSIHBanner", "true");
              }}
              className="hover:text-red-600 transition-colors text-xs font-black cursor-pointer select-none"
              title="Dismiss banner"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Gov Header Navigation */}
      <nav className="bg-[#0B2545] text-white py-3.5 px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">

          {/* Logo with Tricolor Emblem */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-8 h-8 rounded-full border border-slate-400 bg-white flex flex-col overflow-hidden shadow-none shrink-0 transition-transform group-hover:scale-105">
              <div className="bg-[#FF9933] h-[30%] w-full"></div>
              <div className="bg-white h-[40%] w-full flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full border border-[#000080] flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-[#000080] animate-pulse"></div>
                </div>
              </div>
              <div className="bg-[#138808] h-[30%] w-full"></div>
            </div>
            <div className="flex flex-col">
              <div className="text-lg font-black tracking-tight text-white flex items-center leading-none">
                Aid<span className="text-[#FF9933] group-hover:text-white transition-colors duration-300">Nexus</span>
                <span className="ml-1.5 text-[8.5px] uppercase font-extrabold bg-[#E65C00] text-white px-2 py-0.5 rounded-[3px] tracking-wider">
                  PORTAL
                </span>
              </div>
              <span className="text-[8px] text-slate-300 font-bold uppercase tracking-widest mt-0.5">National Civic Hub</span>
            </div>
          </Link>

          {/* Navigation Links - Hidden on Mobile/Tablet (lg breakpoint) */}
          <div className="hidden gap-6 lg:flex text-xs uppercase tracking-wider font-bold">
            <Link to="/" className="text-slate-100 hover:text-[#FF9933] transition-colors">
              Home
            </Link>
            <Link to="/citizen" className="text-slate-300 hover:text-[#FF9933] transition-colors">
              Citizen Corner
            </Link>
            <Link to="/student" className="text-slate-300 hover:text-[#FF9933] transition-colors">
              Student Workspace
            </Link>
            <Link to="/industry" className="text-slate-300 hover:text-[#FF9933] transition-colors">
              Industry Sponsors
            </Link>
            <Link to="/admin" className="text-slate-300 hover:text-[#FF9933] transition-colors">
              Admin Console
            </Link>
          </div>

          {/* Action Buttons & Hamburger Menu */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex gap-3">
              <Link
                to="/login"
                className="rounded-[2px] border border-slate-500 bg-[#134074] px-4 py-1.5 text-xs font-semibold text-slate-100 hover:bg-slate-700 transition-colors uppercase tracking-wider"
              >
                Log In
              </Link>

              <Link
                to="/register"
                className="rounded-[2px] bg-[#E65C00] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#C24E00] shadow-none transition-colors uppercase tracking-wider"
              >
                Register
              </Link>
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-slate-200 hover:text-[#FF9933] p-1.5 border border-slate-500 rounded-[2px] hover:border-[#FF9933] focus:outline-none cursor-pointer"
              aria-label="Toggle Menu"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                ) : (
                  <path d="M4 18h16v-2H4v2zm0-5h16v-2H4v2zm0-7v2h16V6H4z"/>
                )}
              </svg>
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile Links Dropdown Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-[#0B2545] border-t border-slate-700 py-3 px-6 text-xs uppercase tracking-wider font-bold text-slate-300 flex flex-col gap-4">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="hover:text-[#FF9933] transition-colors py-1">
            Home
          </Link>
          <Link to="/citizen" onClick={() => setIsMenuOpen(false)} className="hover:text-[#FF9933] transition-colors py-1">
            Citizen Corner
          </Link>
          <Link to="/student" onClick={() => setIsMenuOpen(false)} className="hover:text-[#FF9933] transition-colors py-1">
            Student Workspace
          </Link>
          <Link to="/industry" onClick={() => setIsMenuOpen(false)} className="hover:text-[#FF9933] transition-colors py-1">
            Industry Sponsors
          </Link>
          <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="hover:text-[#FF9933] transition-colors py-1">
            Admin Console
          </Link>
          
          {/* Action buttons inside mobile dropdown on narrow screen widths (<640px) */}
          <div className="sm:hidden flex flex-col gap-2 pt-2 border-t border-slate-700">
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="w-full text-center rounded-[2px] border border-slate-500 bg-[#134074] py-2 text-xs font-semibold text-slate-100 hover:bg-slate-700 transition-colors uppercase"
            >
              Log In
            </Link>
            <Link
              to="/register"
              onClick={() => setIsMenuOpen(false)}
              className="w-full text-center rounded-[2px] bg-[#E65C00] py-2 text-xs font-bold text-white hover:bg-[#C24E00] uppercase"
            >
              Register
            </Link>
          </div>
        </div>
      )}

      {/* Tricolor Accent Line (Saffron, White with blue wheel, Green) */}
      <div className="h-[4px] w-full flex">
        <div className="h-full bg-[#FF9933] flex-1"></div>
        <div className="h-full bg-white flex-[0.08] relative flex items-center justify-center">
          <div className="w-3.5 h-3.5 rounded-full border border-[#000080] absolute bg-white flex items-center justify-center shadow-inner z-10">
            <div className="w-1.5 h-1.5 rounded-full bg-[#000080]"></div>
          </div>
        </div>
        <div className="h-full bg-[#138808] flex-1"></div>
      </div>
      </div>
      <div className={showBanner ? "h-[101px]" : "h-[64px]"} />
    </>
  );
}