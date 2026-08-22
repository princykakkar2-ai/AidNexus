import { useState } from "react";
import { Link } from "react-router-dom";

export default function Footer(){
    return (
        <footer className="border-t border-slate-200 bg-[#0F172A] text-white py-12">
        <div className="mx-auto max-w-7xl px-6 flex flex-col justify-between gap-6 md:flex-row text-xs text-slate-400">
          <div>
            <p className="font-bold text-slate-200 text-sm mb-2">AidNexus Portal</p>
            <p>© 2026 Smart India Hackathon Project. National Civic Solutions Network.</p>
          </div>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-white">Privacy Policy</Link>
            <Link to="/" className="hover:text-white">Official Contact</Link>
            <Link to="/" className="hover:text-white">Disclaimer</Link>
          </div>
        </div>
      </footer>
        
    );
}