import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import EcosystemAnalytics from "../components/EcosystemAnalytics";
import Step from "../components/Step";
import Footer from "../components/Footer";

// Mock Database of Grievances for Search & Map
const mockProblems = [
  { id: "SIH-1260-A", title: "Pothole Detection & Rapid Patch System", category: "Infrastructure", votes: 342, location: "Ward 12, Delhi", status: "Solutions Open", desc: "Multiple deep potholes on Main Ring Road causing severe traffic congestion and minor accidents daily. Awaiting team matching." },
  { id: "SIH-1260-B", title: "Solar Micro-Grid for Rural Schools", category: "Electricity", votes: 289, location: "Ward 3, Jaipur", status: "Under Review", desc: "Rural primary school lacking continuous electricity supply, hampering digital classes. Proposal for smart microgrid." },
  { id: "SIH-1260-C", title: "AI Water Leak Detection Network", category: "Environment", votes: 210, location: "Zone B, Chennai", status: "Solutions Open", desc: "Main pipeline leakage leading to wastage of thousands of liters of clean drinking water. AI acoustic sensor network suggested." },
  { id: "SIH-1260-D", title: "E-Waste Disposal Smart Bin Network", category: "Waste Management", votes: 195, location: "Sector 62, Noida", status: "Solutions Open", desc: "Lack of dedicated e-waste recycling bins leading to hazardous disposal of mercury-containing devices." },
  { id: "SIH-1260-E", title: "Rural Clinic Telemedicine System", category: "Healthcare", votes: 180, location: "Village Palampur, HP", status: "Under Review", desc: "No specialist doctor visits. High-bandwidth digital diagnostic telemetry terminal needed to connect with AIIMS." },
  { id: "SIH-1260-F", title: "Smart Streetlight Grid Control", category: "Infrastructure", votes: 154, location: "Gachibowli, Hyderabad", status: "Solutions Open", desc: "Streetlights remaining active in broad daylight, waste of grid power. Automated light level sensor arrays." }
];

// Mock Map Pins Data
const mapPins = [
  { id: "SIH-1260-A", label: "Delhi (Potholes)", x: "30%", y: "45%", color: "bg-[#E65C00]" },
  { id: "SIH-1260-B", label: "Jaipur (Solar)", x: "25%", y: "55%", color: "bg-blue-600" },
  { id: "SIH-1260-C", label: "Chennai (Water)", x: "55%", y: "78%", color: "bg-[#E65C00]" },
  { id: "SIH-1260-D", label: "Noida (E-Waste)", x: "35%", y: "42%", color: "bg-[#E65C00]" },
  { id: "SIH-1260-E", label: "Palampur (Clinic)", x: "28%", y: "25%", color: "bg-blue-600" },
  { id: "SIH-1260-F", label: "Hyderabad (Lights)", x: "45%", y: "65%", color: "bg-emerald-600" },
];

export default function Home() {
  const [selectedDomain, setSelectedDomain] = useState("All");
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("All");
  const [searchedId, setSearchedId] = useState("");

  // Map State
  const [activePinId, setActivePinId] = useState("SIH-1260-A");

  const domains = [
    { title: "Infrastructure", icon: "🏢", count: 94, desc: "Road work, public facilities, and civil building reports." },
    { title: "Environment", icon: "🌱", count: 120, desc: "Pollution monitoring, tree preservation, and ecosystem protection." },
    { title: "Transportation", icon: "🚗", count: 83, desc: "Traffic grids, public transit routing, and parking concerns." },
    { title: "Education", icon: "📖", count: 45, desc: "School facilities, digital infrastructure, and vocational support." },
    { title: "Healthcare", icon: "🏥", count: 54, desc: "Community clinics, sanitation outreach, and medical facility access." },
    { title: "Waste Management", icon: "🗑️", count: 130, desc: "Waste collection, local landfills, recycling, and sewage." }
  ];

  // Filtering Logic for Grievances list
  const filteredProblems = mockProblems.filter(prob => {
    const matchesKeyword = searchQuery === "" || 
      prob.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prob.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prob.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = searchCategory === "All" || prob.category === searchCategory;
    
    const matchesId = searchedId === "" || prob.id.toLowerCase().includes(searchedId.trim().toLowerCase());
    
    return matchesKeyword && matchesCategory && matchesId;
  });

  const activePinDetail = mockProblems.find(p => p.id === activePinId) || mockProblems[0];

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      <Navbar />
      <Hero />
      <Stats />

      {/* SEARCH & FILTER BAR */}
      <section className="mx-auto max-w-7xl px-6 pt-10">
        <div className="bg-white border border-[#CCCCCC] rounded-[2px] p-5 shadow-none">
          <h4 className="text-xs font-black uppercase text-[#0A192F] mb-3 tracking-wide">
            🔍 National Grievance Search & Tracking Desk
          </h4>
          <div className="grid gap-3 sm:grid-cols-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Search Keywords</label>
              <input
                type="text"
                placeholder="Pothole, water, clinic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-[2px] border border-[#CCCCCC] px-3 py-2 text-xs outline-none focus:border-[#E65C00]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Department</label>
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="w-full rounded-[2px] border border-[#CCCCCC] px-3 py-2 text-xs text-slate-700 outline-none"
              >
                <option value="All">All Departments</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Electricity">Electricity</option>
                <option value="Environment">Environment</option>
                <option value="Waste Management">Waste Management</option>
                <option value="Healthcare">Healthcare</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Tracking ID</label>
              <input
                type="text"
                placeholder="SIH-1260-A..."
                value={searchedId}
                onChange={(e) => setSearchedId(e.target.value)}
                className="w-full rounded-[2px] border border-[#CCCCCC] px-3 py-2 text-xs outline-none focus:border-[#E65C00]"
              />
            </div>
            <div className="flex items-end">
              <button 
                onClick={() => { setSearchQuery(""); setSearchCategory("All"); setSearchedId(""); }}
                className="w-full bg-[#0A192F] hover:bg-[#132238] text-white py-2 text-xs font-bold rounded-[2px] uppercase tracking-wider cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE MAP VIEW */}
      <section className="mx-auto max-w-7xl px-6 pt-10">
        <div className="bg-white border border-[#CCCCCC] rounded-[2px] p-5 shadow-none">
          <div className="border-b border-[#CCCCCC] pb-3 mb-4">
            <h3 className="text-sm font-black text-[#0A192F] uppercase tracking-wide">
              🗺️ National Incident Map Dashboard (Mock)
            </h3>
            <p className="text-[10px] font-semibold text-slate-600 uppercase mt-0.5">
              Click pins to review regional reported grievances & student matching statuses
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* SVG MAP BOX */}
            <div className="md:col-span-2 relative h-80 bg-slate-100 border border-[#CCCCCC] rounded-[2px] overflow-hidden select-none">
              {/* Simple background grid map */}
              <svg className="w-full h-full opacity-60" viewBox="0 0 800 400" fill="none">
                <rect width="800" height="400" fill="#E8EEF5"/>
                {/* Simulated administrative zones/roads */}
                <path d="M 0,100 Q 200,80 400,120 T 800,90" stroke="#FFFFFF" strokeWidth="12"/>
                <path d="M 0,100 Q 200,80 400,120 T 800,90" stroke="#CCCCCC" strokeWidth="2"/>
                
                <path d="M 150,0 Q 250,200 210,400" stroke="#FFFFFF" strokeWidth="12"/>
                <path d="M 150,0 Q 250,200 210,400" stroke="#CCCCCC" strokeWidth="2"/>
                
                <path d="M 600,0 Q 550,150 630,400" stroke="#FFFFFF" strokeWidth="8"/>
                <path d="M 600,0 Q 550,150 630,400" stroke="#CCCCCC" strokeWidth="1.5"/>

                {/* Simulated Green Parks */}
                <rect x="50" y="220" width="120" height="90" fill="#C2E2C4" stroke="#A3D4A6" strokeWidth="1"/>
                <rect x="420" y="50" width="90" height="80" fill="#C2E2C4" stroke="#A3D4A6" strokeWidth="1"/>
                
                {/* Boundary labels */}
                <text x="50" y="30" fill="#777777" fontSize="10" fontWeight="bold">NORTHERN ZONE</text>
                <text x="650" y="380" fill="#777777" fontSize="10" fontWeight="bold">EASTERN WARD</text>
              </svg>

              {/* Map Pins */}
              {mapPins.map((pin) => (
                <button
                  key={pin.id}
                  onClick={() => setActivePinId(pin.id)}
                  style={{ left: pin.x, top: pin.y }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-white flex items-center justify-center cursor-pointer shadow-md ${pin.color} ${
                    activePinId === pin.id ? "ring-4 ring-offset-1 ring-[#0A192F] scale-125" : ""
                  } transition-all`}
                  title={pin.label}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                </button>
              ))}
            </div>

            {/* DETAIL SIDE PANEL */}
            <div className="bg-slate-50 border border-[#CCCCCC] p-5 rounded-[2px] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center pb-2 border-b border-[#CCCCCC]">
                  <span className="text-[9px] font-black text-slate-500 uppercase">Case: {activePinDetail.id}</span>
                  <span className={`badge-gov ${
                    activePinDetail.status === "Solutions Open"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                      : "bg-amber-50 text-amber-800 border-amber-300"
                  }`}>
                    {activePinDetail.status}
                  </span>
                </div>
                
                <h4 className="text-sm font-extrabold text-[#0A192F] mt-3 uppercase tracking-wide">{activePinDetail.title}</h4>
                <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase">📍 {activePinDetail.location}</p>
                
                <p className="text-xs text-slate-700 mt-3 leading-relaxed font-semibold">
                  {activePinDetail.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-[#CCCCCC] mt-4 flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase bg-slate-200 px-2 py-0.5 rounded-[2px] border border-[#CCCCCC] text-slate-700">
                  {activePinDetail.category}
                </span>
                <span className="text-xs font-black text-[#E65C00]">
                  ▲ {activePinDetail.votes} Endorsements
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ECOSYSTEM ANALYTICS SECTION */}
      <section className="mx-auto max-w-7xl px-6 pt-10">
        <EcosystemAnalytics />
      </section>

      {/* INTERACTIVE DOMAIN GRID */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="text-center mb-8">
          <p className="text-xs font-black uppercase tracking-wider text-[#E65C00]">
            Official Classification
          </p>
          <h2 className="mt-2 text-2xl font-black text-[#0A192F] uppercase tracking-wide">
            Explore Problem Domains
          </h2>
          <p className="mt-1 text-slate-600 text-xs font-semibold max-w-md mx-auto">
            Intelligently classified problem categories monitored by administrative departments.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {domains.map((dom) => (
            <div
              key={dom.title}
              onClick={() => setSelectedDomain(dom.title)}
              className={`card-gov p-5 cursor-pointer border transition-colors flex flex-col justify-between ${
                selectedDomain === dom.title
                  ? "border-[#E65C00] bg-[#FFF9F5]"
                  : "border-[#CCCCCC] bg-white"
              }`}
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-2xl">{dom.icon}</span>
                  <span className="bg-slate-100 text-[#0A192F] text-[10px] font-bold px-2 py-0.5 rounded-[2px] border border-[#CCCCCC]">
                    {dom.count} Active
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#0A192F] mt-4 uppercase tracking-wide">{dom.title}</h3>
                <p className="text-xs text-slate-700 mt-1.5 leading-relaxed font-semibold">{dom.desc}</p>
              </div>
              <div className="mt-5 text-right text-[11px] font-bold text-[#E65C00] uppercase tracking-wider">
                View Category Issues →
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DYNAMIC SEARCH RESULTS OR TRENDING CIVIC DEMANDS */}
      <section className="mx-auto max-w-7xl px-6 py-10 border-t border-[#CCCCCC]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-[#0A192F] uppercase tracking-wide">
              {searchQuery || searchedId || searchCategory !== "All" ? "Searched Grievances Search Results" : "Top Priority Civic Demands"}
            </h2>
            <p className="text-slate-600 text-xs font-semibold mt-0.5">
              {searchQuery || searchedId || searchCategory !== "All" 
                ? `Showing ${filteredProblems.length} records matching your query` 
                : "Issues flagged for urgent academic team matching"}
            </p>
          </div>
          <Link to="/citizen" className="text-xs font-extrabold text-[#E65C00] hover:underline uppercase tracking-wider">
            View All Reports
          </Link>
        </div>

        {filteredProblems.length === 0 ? (
          <div className="bg-white border border-[#CCCCCC] rounded-[2px] p-12 text-center text-slate-500 font-semibold">
            🚫 No matching grievances found in records matching the criteria.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {filteredProblems.map(prob => (
              <TrendingCard
                key={prob.id}
                id={prob.id}
                title={prob.title}
                category={prob.category}
                votes={prob.votes}
                location={prob.location}
                status={prob.status}
              />
            ))}
          </div>
        )}
      </section>

      {/* RESOLVED CASES & SUCCESS STORIES SECTION */}
      <section className="mx-auto max-w-7xl px-6 py-12 border-t border-[#CCCCCC]">
        <div className="text-center mb-8">
          <p className="text-xs font-black uppercase tracking-wider text-[#138808]">
            National Success Gallery
          </p>
          <h2 className="mt-2 text-2xl font-black text-[#0A192F] uppercase tracking-wide">
            Resolved Grievances & Prototypes
          </h2>
          <p className="mt-1 text-slate-600 text-xs font-semibold max-w-md mx-auto">
            Review recently resolved societal issues successfully solved by student teams with sponsor aid.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="border border-[#CCCCCC] rounded-[2px] bg-white p-5 shadow-none border-t-4 border-t-[#138808]">
            <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase tracking-wide mb-3">
              <span>📍 Pune Municipal Corp</span>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-[2px] uppercase">Deployed</span>
            </div>
            <h3 className="font-extrabold text-[#0A192F] text-sm uppercase tracking-wide">Automated Water Quality Monitor</h3>
            <p className="text-xs text-slate-700 font-semibold mt-2.5 leading-relaxed">
              Developed an IoT water monitoring node that checks pH, turbidity, and chlorine level in local municipal pipes.
            </p>
            <div className="mt-5 border-t border-slate-100 pt-3 flex flex-col gap-1.5 text-[10px] font-bold text-slate-600 uppercase">
              <p>🎓 TEAM: <span className="text-[#0A192F]">HydroVigil (IIT Kanpur)</span></p>
              <p>🏢 SPONSOR: <span className="text-[#E65C00]">Tata Utilities Group</span></p>
            </div>
          </div>

          <div className="border border-[#CCCCCC] rounded-[2px] bg-white p-5 shadow-none border-t-4 border-t-[#138808]">
            <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase tracking-wide mb-3">
              <span>📍 Bengaluru Traffic Control</span>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-[2px] uppercase">Pilot Completed</span>
            </div>
            <h3 className="font-extrabold text-[#0A192F] text-sm uppercase tracking-wide">Smart Density Traffic Signal</h3>
            <p className="text-xs text-slate-700 font-semibold mt-2.5 leading-relaxed">
              Implemented a computer-vision camera algorithm adjusting intersection timings based on vehicle queues, reducing wait time by 28%.
            </p>
            <div className="mt-5 border-t border-slate-100 pt-3 flex flex-col gap-1.5 text-[10px] font-bold text-slate-600 uppercase">
              <p>🎓 TEAM: <span className="text-[#0A192F]">CodeCrafters (BITS Pilani)</span></p>
              <p>🏢 SPONSOR: <span className="text-[#E65C00]">NHAI & myGov</span></p>
            </div>
          </div>

          <div className="border border-[#CCCCCC] rounded-[2px] bg-white p-5 shadow-none border-t-4 border-t-[#138808]">
            <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase tracking-wide mb-3">
              <span>📍 Delhi Swachh Office</span>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-[2px] uppercase">Scaled Nationwide</span>
            </div>
            <h3 className="font-extrabold text-[#0A192F] text-sm uppercase tracking-wide">Solid Waste Routing Engine</h3>
            <p className="text-xs text-slate-700 font-semibold mt-2.5 leading-relaxed">
              Created an AI waste routing engine for city collection trucks mapping paths dynamically based on smart trash bin fill levels.
            </p>
            <div className="mt-5 border-t border-slate-100 pt-3 flex flex-col gap-1.5 text-[10px] font-bold text-slate-600 uppercase">
              <p>🎓 TEAM: <span className="text-[#0A192F]">CleanTech (DTU, Delhi)</span></p>
              <p>🏢 SPONSOR: <span className="text-[#E65C00]">Swachh Bharat Mission</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* WORKFLOW ROADMAP */}
      <section className="mx-auto max-w-7xl px-6 py-12 border-t border-[#CCCCCC] bg-slate-50">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-wider text-[#E65C00]">
            Operational Architecture
          </p>
          <h2 className="mt-2 text-2xl font-black text-[#0A192F] uppercase tracking-wide">
            How The Ecosystem Solves Problems
          </h2>
          <p className="mx-auto mt-1 max-w-xl text-slate-600 text-xs font-semibold">
            Intelligently linking community demands with capabilities and resource sponsorships.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
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

function TrendingCard({ id, title, category, votes, location, status }) {
  return (
    <div className="rounded-[2px] border border-[#CCCCCC] bg-white p-5 shadow-none">
      <div className="flex justify-between items-center text-[10px] text-slate-600 font-bold mb-3 uppercase tracking-wide">
        <span className="font-mono">ID: {id}</span>
        <span className={`badge-gov ${
          status === "Solutions Open" 
            ? "bg-emerald-50 text-emerald-800 border-emerald-300" 
            : "bg-amber-50 text-amber-800 border-amber-300"
        }`}>
          {status}
        </span>
      </div>
      <h3 className="font-bold text-[#0A192F] text-sm uppercase tracking-wide line-clamp-2 min-h-[40px]">{title}</h3>
      <p className="text-[10px] text-slate-500 font-bold mt-1.5 uppercase">📍 {location}</p>
      <div className="mt-4 flex items-center justify-between border-t border-[#CCCCCC] pt-3">
        <span className="bg-slate-100 border border-[#CCCCCC] rounded-[2px] px-2 py-0.5 text-[9px] font-bold text-slate-700 uppercase tracking-wide">
          {category}
        </span>
        <div className="text-xs font-black text-[#E65C00]">
          ▲ {votes} Upvotes
        </div>
      </div>
    </div>
  );
}
