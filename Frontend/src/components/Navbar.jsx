import React from 'react';
import { Link } from "react-router-dom";

export default function Navbar(){
    return(
        <nav className="border-b border-[#0f3d38] bg-[#072421]/80 backdrop-blur-md sticky top-0 z-50">
                  <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
                    <Link to="/" className="text-2xl font-bold tracking-tight text-[#f5f5f5]">
                      Aid<span className="text-[#2dd4bf]">Nexus</span>
                    </Link>
        
                    <div className="hidden gap-8 md:flex text-sm">
                      <Link to="/" className="text-[#2dd4bf] font-semibold">
                        Home
                      </Link>
                      <Link to="/problems" className="text-slate-300 hover:text-white">
                        Problems
                      </Link>
                      <Link to="/solutions" className="text-slate-300 hover:text-white">
                        Solutions
                      </Link>
                      <Link to="/about" className="text-slate-300 hover:text-white">
                        About
                      </Link>
                    </div>
        
                    <div className="flex gap-3">
                      <Link
                        to="/login"
                        className="rounded-full border border-[#115e59] px-4 py-2 text-sm text-slate-200 hover:bg-[#0f3d38]"
                      >
                        Login
                      </Link>
        
                      <Link
                        to="/register"
                        className="rounded-full bg-[#fde047] px-4 py-2 text-sm font-semibold text-[#072421] hover:bg-[#facc15] shadow-sm"
                      >
                        Register
                      </Link>
                    </div>
        
                  </div>
                </nav>
        
    );
}