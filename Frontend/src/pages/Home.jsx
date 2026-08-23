import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Step from "../components/Step";
import Footer from "../components/Footer";

export default function Home() {
  const [selectedDomain, setSelectedDomain] = useState("All");

  const domains = [
    { title: "Infrastructure", icon: "🏢", count: 94, desc: "Road work, public facilities, and civil building reports." },
    { title: "Environment", icon: "🌱", count: 120, desc: "Pollution monitoring, tree preservation, and ecosystem protection." },
    { title: "Transportation", icon: "🚗", count: 83, desc: "Traffic grids, public transit routing, and parking concerns." },
    { title: "Education", icon: "📖", count: 45, desc: "School facilities, digital infrastructure, and vocational support." },
    { title: "Healthcare", icon: "🏥", count: 54, desc: "Community clinics, sanitation outreach, and medical facility access." },
    { title: "Waste Management", icon: "🗑️", count: 130, desc: "Waste collection, local landfills, recycling, and sewage." }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <Hero />
      <Stats />

      {/* INTERACTIVE DOMAIN GRID */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-[#D97706]">
            OFFICIAL CLASSIFICATION
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Explore Problem Domains
          </h2>
          <p className="mt-2 text-slate-600 text-sm max-w-md mx-auto">
            Intelligently classified problem categories monitored by administrative departments.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {domains.map((dom) => (
            <div
              key={dom.title}
              onClick={() => setSelectedDomain(dom.title)}
              className={`card-gov p-6 cursor-pointer border-2 transition-all flex flex-col justify-between ${
                selectedDomain === dom.title
                  ? "border-[#D97706] bg-[#FFFBEB]"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-3xl">{dom.icon}</span>
                  <span className="bg-slate-100 text-[#0F172A] text-xs font-bold px-2 py-0.5 rounded-[4px] border border-slate-200">
                    {dom.count} Active
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] mt-4">{dom.title}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{dom.desc}</p>
              </div>
              <div className="mt-6 text-right text-xs font-bold text-[#D97706]">
                View Category Issues →
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TOP VOTED CIVIC ISSUES */}
      <section className="mx-auto max-w-7xl px-6 py-8 border-t border-slate-200">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">Top Priority Civic Demands</h2>
            <p className="text-slate-500 text-sm">Issues flagged for urgent academic team matching</p>
          </div>
          <Link to="/citizen" className="text-xs font-bold text-[#D97706] hover:underline uppercase tracking-wider">
            View All Reports
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <TrendingCard
            title="Pothole Detection & Rapid Patch System"
            category="Infrastructure"
            votes={342}
            location="Ward 12, Delhi"
            status="Solutions Open"
          />
          <TrendingCard
            title="Solar Micro-Grid for Rural Schools"
            category="Electricity"
            votes={289}
            location="Ward 3, Jaipur"
            status="Under Review"
          />
          <TrendingCard
            title="AI Water Leak Detection Network"
            category="Environment"
            votes={210}
            location="Zone B, Chennai"
            status="Solutions Open"
          />
        </div>
      </section>

      {/* WORKFLOW ROADMAP */}
      <section className="mx-auto max-w-7xl px-6 py-20 border-t border-slate-200">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#D97706]">
            OPERATIONAL ARCHITECTURE
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-[#0F172A] tracking-tight">
            How The Ecosystem Solves Problems
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-600 text-sm">
            Intelligently linking community demands with capabilities and resource sponsorships.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-4">
          <Step number="01" icon="📝" title="Citizen Report" text="Issues are logged with descriptions, GPS geolocations, and photos." />
          <Step number="02" icon="🤖" title="AI Verification" text="FastAPI model reviews, categorizes, detects duplicates, and assigns priority." />
          <Step number="03" icon="💡" title="Academic Match" text="Capability-based algorithms assign student innovation teams to build prototypes." />
          <Step number="04" icon="🚀" title="Sponsor Support" text="NGOs and industry partners sponsor teams with funding, tools, and tech." />
        </div>
      </section>
      <Footer />
    </div>
  );
}

/* ---------- Sub-components ---------- */

function TrendingCard({ title, category, votes, location, status }) {
  return (
    <div className="rounded-[6px] border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-center text-xs text-slate-500 mb-3">
        <span>📍 {location}</span>
        <span className={`badge-gov ${
          status === "Solutions Open" 
            ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
            : "bg-amber-50 text-amber-700 border-amber-200"
        }`}>
          {status}
        </span>
      </div>
      <h3 className="font-bold text-[#0F172A] text-sm line-clamp-2 min-h-[40px]">{title}</h3>
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="bg-slate-100 border border-slate-200 rounded-[4px] px-2 py-0.5 text-[10px] font-bold text-slate-700 uppercase">
          {category}
        </span>
        <div className="text-xs font-bold text-[#D97706]">
          ▲ {votes} Upvotes
        </div>
      </div>
    </div>
  );
}

function Stat({ number, label }) {
  return (
    <div className="text-center">
      <h3 className="text-4xl font-extrabold text-[#D97706] tracking-tight">{number}</h3>
      <p className="mt-2 text-xs font-bold text-[#0F172A] uppercase tracking-wide">{label}</p>
    </div>
  );
}

