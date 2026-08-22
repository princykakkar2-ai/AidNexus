import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import solar from "../assets/solar.png";
import leakage from "../assets/water-leakage.png"

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");

  const domains = [
    { name: "All", icon: "🌐", count: "1,248" },
    { name: "Environment", icon: "🌱", count: "312" },
    { name: "Transportation", icon: "🚦", count: "284" },
    { name: "Education", icon: "📚", count: "195" },
    { name: "Healthcare", icon: "🏥", count: "168" },
    { name: "Infrastructure", icon: "🏗️", count: "289" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans selection:bg-slate-800 selection:text-white">
      <Navbar/>
      {/* Top Official Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-6 border-b border-slate-800">
        <div className="mx-auto max-w-7xl flex justify-between items-center">
          <span className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Official Civic Governance & Innovation Portal
          </span>
          <span className="hidden sm:inline text-slate-400">Smart India Hackathon Initiative</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative border-b border-slate-200 bg-white py-20">
        <div className="mx-auto max-w-5xl px-6 text-center">
          
          <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 shadow-sm">
            <span>🏛️</span> Citizen-State Collaboration Framework
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            Empowering Citizens. <br className="hidden sm:inline" />
            <span className="text-slate-700">Engineering Solutions.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            A unified platform connecting public administration, academic institutions, and citizen bodies to systematically address infrastructure and civic challenges.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link
              to="/submit-problem"
              className="rounded-md bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-slate-800 transition-all"
            >
              Lodge a Civic Grievance →
            </Link>

            <Link
              to="/problems"
              className="rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all"
            >
              Browse Open Repositories
            </Link>
          </div>

        </div>
      </section>

      {/* Official Metrics Bar */}
      <section className="border-b border-slate-200 bg-slate-100/70">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y md:divide-y-0 divide-slate-200 border-x border-slate-200 md:grid-cols-4">
          <Stat number="1,248" label="Logged Issues" />
          <Stat number="586" label="Deployed Solutions" />
          <Stat number="240" label="Institutional Partners" />
          <Stat number="85" label="Municipal Bodies" />
        </div>
      </section>

      {/* Interactive Domain Explorer Grid */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Domain Classification</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">Explore Civic Sectors</h2>
          </div>
          <p className="text-sm text-slate-500 mt-2 md:mt-0">Filter issues by department oversight</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {domains.map((domain) => {
            const isActive = activeCategory === domain.name;
            return (
              <button
                key={domain.name}
                onClick={() => setActiveCategory(domain.name)}
                className={`group relative flex flex-col items-start p-4 rounded-lg border text-left transition-all ${
                  isActive
                    ? "border-slate-900 bg-slate-900 text-white shadow-md"
                    : "border-slate-200 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <span className="text-2xl">{domain.icon}</span>
                  <span
                    className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                      isActive ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {domain.count}
                  </span>
                </div>
                <span className="text-sm font-semibold tracking-tight">{domain.name}</span>
                <span className={`text-[11px] mt-0.5 ${isActive ? "text-slate-400" : "text-slate-500"}`}>
                  View Registry
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Top Voted Issues */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Priority Grievance Registry</h2>
            <p className="text-xs text-slate-500">Highest citizen endorsement requires technical review</p>
          </div>
          <Link to="/problems" className="text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-slate-900 underline">
            Full Index →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <RegistryCard
            image="https://images.unsplash.com/photo-1515260268569-9271009adfdb?w=600&auto=format&fit=crop&q=80"
            title="Pothole Detection & Rapid Patch System"
            category="Infrastructure"
            votes={342}
            location="Ward 12, New Delhi"
            status="Under Evaluation"
          />
          <RegistryCard
            image={solar}
            category="Clean Energy"
            votes={289}
            location="Pune District"
            status="Pilot Phase"
          />
          <RegistryCard
            image={leakage}
            title="AI Water Leak Detection Network"
            category="Environment"
            votes={210}
            location="Bengaluru South"
            status="Open for Bids"
          />
        </div>
      </section>

      {/* Official Workflow Process */}
      <section className="mx-auto max-w-7xl px-6 py-16 border-t border-slate-200 mt-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Standard Operating Procedure</span>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">Resolution Protocol</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Step number="01" title="1. Submission" text="Validated citizen entry with geo-tagged verification." />
          <Step number="02" title="2. Triage" text="Automated classification and priority allocation." />
          <Step number="03" title="3. R&D" text="Student and institutional innovation proposals." />
          <Step number="04" title="4. Execution" text="Municipal endorsement and field implementation." />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-6 py-8 text-xs text-slate-500 md:flex-row">
          <p>© 2026 CivicConnect Governance Portal. Built for Smart India Hackathon.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-slate-800">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-slate-800">Terms of Service</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}

/* ---------- Sub-components ---------- */

function RegistryCard({ image, title, category, votes, location, status }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white overflow-hidden shadow-sm hover:border-slate-400 transition-all">
      <div className="h-40 w-full overflow-hidden relative bg-slate-100">
        <img src={image} alt={title} loading="lazy" className="h-full w-full object-cover" />
        <span className="absolute top-3 right-3 rounded bg-slate-900/90 text-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider">
          {status}
        </span>
      </div>
      <div className="p-5">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">📍 {location}</span>
        <h3 className="font-bold text-slate-900 text-base mt-1 line-clamp-1">{title}</h3>
        
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="rounded bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-700">
            {category}
          </span>
          <span className="text-xs font-bold text-slate-900">
            {votes} Endorsements
          </span>
        </div>
      </div>
    </div>
  );
}

function Stat({ number, label }) {
  return (
    <div className="p-6 text-center">
      <div className="text-3xl font-extrabold text-slate-900 font-mono">{number}</div>
      <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</div>
    </div>
  );
}

function Step({ number, title, text }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <span className="text-xs font-mono font-bold text-slate-400">{number}</span>
      <h3 className="mt-2 text-base font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-xs leading-relaxed text-slate-600">{text}</p>
    </div>
  );
}