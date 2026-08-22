import React, { useState } from 'react';
import { Link } from "react-router-dom";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-50 transition-all duration-200">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
                
                {/* Brand Logo */}
                <Link to="/" className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-slate-900 group">
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-900 text-xs font-bold text-white shadow-sm">
                        CN
                    </span>
                    <span>Civic<span className="text-slate-600 font-semibold">Connect</span></span>
                </Link>

                {/* Desktop Navigation Links */}
                <div className="hidden gap-7 md:flex text-sm font-medium">
                    <Link to="/" className="text-slate-900 font-semibold border-b-2 border-slate-900 pb-0.5">
                        Home
                    </Link>
                    <Link to="/problems" className="text-slate-600 hover:text-slate-900 transition-colors">
                        Problems
                    </Link>
                    <Link to="/solutions" className="text-slate-600 hover:text-slate-900 transition-colors">
                        Solutions
                    </Link>
                    <Link to="/about" className="text-slate-600 hover:text-slate-900 transition-colors">
                        About
                    </Link>
                </div>

                {/* Desktop Action Buttons */}
                <div className="hidden md:flex gap-3 items-center">
                    <Link
                        to="/login"
                        className="rounded-md border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                    >
                        Sign In
                    </Link>

                    <Link
                        to="/register"
                        className="rounded-md bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 shadow-sm transition-all"
                    >
                        Register Account
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden text-slate-700 focus:outline-none hover:text-slate-900 p-1"
                    aria-label="Toggle Menu"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Dropdown Menu */}
            <div className={`md:hidden overflow-hidden transition-all duration-200 ease-in-out ${isOpen ? 'max-h-96 opacity-100 py-4 border-t border-slate-200 bg-white' : 'max-h-0 opacity-0 py-0'}`}>
                <div className="flex flex-col gap-3 px-6 text-sm">
                    <Link to="/" onClick={() => setIsOpen(false)} className="text-slate-900 font-semibold">Home</Link>
                    <Link to="/problems" onClick={() => setIsOpen(false)} className="text-slate-600 hover:text-slate-900">Problems</Link>
                    <Link to="/solutions" onClick={() => setIsOpen(false)} className="text-slate-600 hover:text-slate-900">Solutions</Link>
                    <Link to="/about" onClick={() => setIsOpen(false)} className="text-slate-600 hover:text-slate-900">About</Link>
                    
                    <div className="flex gap-3 pt-3 border-t border-slate-100 mt-1">
                        <Link to="/login" onClick={() => setIsOpen(false)} className="flex-1 text-center rounded-md border border-slate-300 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                            Sign In
                        </Link>
                        <Link to="/register" onClick={() => setIsOpen(false)} className="flex-1 text-center rounded-md bg-slate-900 py-2 text-xs font-semibold text-white hover:bg-slate-800">
                            Register Account
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}