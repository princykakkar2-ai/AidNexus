import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import EmptyState from "../../components/EmptyState";
import { 
  fetchProjects, 
  offerProjectSupport, 
  fetchExpertSolutions 
} from "../../services/api";

export default function ExpertDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Detect if accessing via the Industry Sponsorship alias route
  const isIndustry = location.pathname.includes("/industry");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // 1. STATE FOR SPONSORSHIP / INDUSTRY HUB
  // ==========================================
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [partnerName, setPartnerName] = useState("");
  const [supportItems, setSupportItems] = useState({
    Funding: false,
    Mentorship: false,
    Technology: false,
    Equipment: false,
  });

  // Sponsorship Filtering states
  const [sponCategory, setSponCategory] = useState("All");
  const [sponStatus, setSponStatus] = useState("All");
  const [sponSearch, setSponSearch] = useState("");

  const defaultProjects = useMemo(() => [
    {
      _id: "default-proj-1",
      title: "Automated Municipal Water Quality Monitor",
      teamName: "HydroVigil (IIT Kanpur)",
      status: "SEEKING_FUNDING",
      progress: 75,
      category: "Sanitation",
      supportNeeded: ["Funding", "Equipment"],
      description: "A compact IoT monitoring node that continuously tracks municipal water pH, chlorine, and turbidity. Seeking grants for field trial sensor arrays.",
      fundingTarget: 500000,
      fundingAllocated: 150000,
      industryPartner: null
    },
    {
      _id: "default-proj-2",
      title: "Solar Off-Grid Classroom Power Hub",
      teamName: "Team Surya (BITS Pilani)",
      status: "IN_PROGRESS",
      progress: 40,
      category: "Technology",
      supportNeeded: ["Equipment", "Mentorship"],
      description: "Developing custom micro-grid solar battery arrays to support digital learning terminals in remote rural primary schools lacking grid power.",
      fundingTarget: 600000,
      fundingAllocated: 600000,
      industryPartner: "Reliance Digital Foundation",
      industrySupport: ["Equipment", "Mentorship"]
    },
    {
      _id: "default-proj-3",
      title: "Smart Traffic Density Light System",
      teamName: "CodeCrafters (BITS Pilani)",
      status: "COMPLETED",
      progress: 100,
      category: "Infrastructure",
      supportNeeded: ["Funding"],
      description: "Completed pilot testing of computer-vision cameras that adjust traffic signal timings dynamically, reducing wait times at urban intersections.",
      fundingTarget: 300000,
      fundingAllocated: 300000,
      industryPartner: "Tata Utilities Group",
      industrySupport: ["Funding"]
    }
  ], []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load active project initiatives.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSupportModal = (project) => {
    setActiveProject(project);
    setPartnerName("");
    setSupportItems({
      Funding: false,
      Mentorship: false,
      Technology: false,
      Equipment: false,
    });
    setSuccess("");
    setError("");
  };

  const handleCheckboxChange = (name) => {
    setSupportItems((current) => ({
      ...current,
      [name]: !current[name],
    }));
  };

  const handleSubmitSupport = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!partnerName.trim()) {
      setError("Please enter your organization name.");
      return;
    }

    const selectedSupport = Object.entries(supportItems)
      .filter(([_, checked]) => checked)
      .map(([name]) => name);

    if (selectedSupport.length === 0) {
      setError("Please select at least one type of support to offer.");
      return;
    }

    try {
      await offerProjectSupport(activeProject._id, partnerName, selectedSupport);
      setSuccess(`Thank you! Successfully registered support for "${activeProject.title}".`);
      setActiveProject(null);
      await loadProjects();
    } catch (err) {
      setError("Failed to submit support offer.");
    }
  };

  // Combine database projects with defaults & map clean parameters
  const combinedProjects = useMemo(() => {
    const formattedProjects = projects.map(p => ({
      ...p,
      description: p.description || "Developing a prototype solution addressing the logged public service grievance using regional student innovation resources.",
      category: p.category || "Infrastructure",
      fundingTarget: p.fundingTarget || 500000,
      fundingAllocated: p.fundingAllocated || (p.industryPartner ? 500000 : 0),
      status: p.status || "SEEKING_FUNDING"
    }));
    return [...formattedProjects, ...defaultProjects];
  }, [projects, defaultProjects]);

  // Apply filters
  const filteredProjects = useMemo(() => {
    return combinedProjects.filter(p => {
      const matchesSearch = sponSearch === "" || 
        p.title.toLowerCase().includes(sponSearch.toLowerCase()) ||
        p.teamName.toLowerCase().includes(sponSearch.toLowerCase()) ||
        p.description.toLowerCase().includes(sponSearch.toLowerCase());
      
      const matchesCategory = sponCategory === "All" || p.category === sponCategory;
      
      const matchesStatus = sponStatus === "All" || p.status === sponStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [combinedProjects, sponSearch, sponCategory, sponStatus]);

  // ==========================================
  // 2. STATE FOR EXPERT SOLUTION REVIEW
  // ==========================================
  const [solutions, setSolutions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("NEWEST");

  const loadSolutions = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchExpertSolutions();
      setSolutions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Unable to load student solution reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isIndustry) {
      loadProjects();
    } else {
      loadSolutions();
    }
  }, [isIndustry]);

  // Statistics for Solutions Review
  const statistics = useMemo(() => {
    return {
      total: solutions.length,
      underReview: solutions.filter(s => s.status === "UNDER_REVIEW" || s.status === "Pending").length,
      approved: solutions.filter(s => s.status === "APPROVED" || s.status === "Approved").length,
      needsImprovement: solutions.filter(s => s.status === "NEEDS_IMPROVEMENT" || s.status === "Needs Improvement").length,
      rejected: solutions.filter(s => s.status === "REJECTED" || s.status === "Rejected").length,
    };
  }, [solutions]);

  // Filter Solutions
  const filteredSolutions = useMemo(() => {
    let result = [...solutions];

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      result = result.filter(sol => 
        sol.project_title?.toLowerCase().includes(search) ||
        sol.student_name?.toLowerCase().includes(search) ||
        sol.problem_description?.toLowerCase().includes(search) ||
        sol.technologies?.toLowerCase().includes(search)
      );
    }

    if (statusFilter !== "ALL") {
      result = result.filter(sol => {
        const s = sol.status;
        if (statusFilter === "UNDER_REVIEW") return s === "UNDER_REVIEW" || s === "Pending";
        if (statusFilter === "APPROVED") return s === "APPROVED" || s === "Approved";
        if (statusFilter === "REJECTED") return s === "REJECTED" || s === "Rejected";
        if (statusFilter === "NEEDS_IMPROVEMENT") return s === "NEEDS_IMPROVEMENT" || s === "Needs Improvement";
        return true;
      });
    }

    result.sort((a, b) => {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      return sortOrder === "NEWEST" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [solutions, searchTerm, statusFilter, sortOrder]);

  const getStatusColor = (status) => {
    const s = status ? status.toUpperCase() : "";
    if (s.includes("APPROV")) return "bg-green-50 text-green-800 border-green-300";
    if (s.includes("REJECT")) return "bg-red-50 text-red-800 border-red-300";
    if (s.includes("IMPROVE")) return "bg-amber-50 text-amber-800 border-amber-300";
    return "bg-blue-50 text-blue-800 border-blue-300";
  };

  // ==========================================
  // 3. RENDER LOGIC
  // ==========================================

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-12" id="main-content">
        {/* SUCCESS / ERROR ALERTS */}
        {error && (
          <div className="mb-6 rounded-[2px] bg-red-50 p-4 text-xs font-bold text-red-700 border border-red-200">
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div className="mb-6 rounded-[2px] bg-green-50 p-4 text-xs font-bold text-green-700 border border-green-200">
            ✓ {success}
          </div>
        )}

        {isIndustry ? (
          <div>
            <div className="border-b border-slate-200 pb-6 mb-8">
              <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight">
                Industry & NGO Sponsorship Hub
              </h1>
              <p className="text-sm text-slate-500 mt-2 font-medium">
                Review active student project initiatives and allocate sponsorship support.
              </p>
            </div>

            {/* Platform Impact Header Banner */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 text-center border-t-4 border-t-[#0B2545]">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Active Initiatives</span>
                <p className="text-2xl font-black text-slate-800 mt-1">{combinedProjects.length}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 text-center border-t-4 border-t-blue-500">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Corporate Sponsors</span>
                <p className="text-2xl font-black text-blue-600 mt-1">8 Partners</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 text-center border-t-4 border-t-emerald-500">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Funds Allocated</span>
                <p className="text-2xl font-black text-emerald-600 mt-1">₹24.5 Lakhs</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 text-center border-t-4 border-t-amber-500">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Mentors Registered</span>
                <p className="text-2xl font-black text-amber-600 mt-1">14 Experts</p>
              </div>
            </div>

            {/* CSR Impact Analytics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* SVG Bar Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col justify-between">
                <h4 className="text-xs font-black text-[#0B2545] uppercase tracking-wider mb-4">Grants & Funding Allocation</h4>
                <div className="h-44 w-full flex items-end gap-5 px-4 border-b border-slate-200 pb-2">
                  <div className="flex-1 flex flex-col items-center gap-1 group relative">
                    <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0B2545] text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider whitespace-nowrap">₹6.0 Lakhs</div>
                    <div className="w-8 bg-blue-600 hover:bg-blue-700 rounded-t-sm h-36 transition-all duration-300"></div>
                    <span className="text-[8px] font-extrabold text-slate-500 uppercase tracking-widest mt-1">Tech</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1 group relative">
                    <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0B2545] text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider whitespace-nowrap">₹3.0 Lakhs</div>
                    <div className="w-8 bg-amber-500 hover:bg-amber-600 rounded-t-sm h-18 transition-all duration-300"></div>
                    <span className="text-[8px] font-extrabold text-slate-500 uppercase tracking-widest mt-1">Infr</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1 group relative">
                    <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0B2545] text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider whitespace-nowrap">₹1.5 Lakhs</div>
                    <div className="w-8 bg-emerald-500 hover:bg-emerald-600 rounded-t-sm h-9 transition-all duration-300"></div>
                    <span className="text-[8px] font-extrabold text-slate-500 uppercase tracking-widest mt-1">Sani</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1 group relative">
                    <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0B2545] text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider whitespace-nowrap">₹14.0 Lakhs</div>
                    <div className="w-8 bg-indigo-600 hover:bg-indigo-700 rounded-t-sm h-40 transition-all duration-300"></div>
                    <span className="text-[8px] font-extrabold text-slate-500 uppercase tracking-widest mt-1">Roads</span>
                  </div>
                </div>
                <div className="mt-3 text-[9px] font-semibold text-slate-400 uppercase text-center">Funds Allocated by Category</div>
              </div>

              {/* SVG Donut Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col justify-between">
                <h4 className="text-xs font-black text-[#0B2545] uppercase tracking-wider mb-4">Category Resource Distribution</h4>
                <div className="h-44 w-full flex items-center justify-center gap-6">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#E2E8F0" strokeWidth="3.5" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#6366F1" strokeWidth="3.5" strokeDasharray="57 100" strokeDashoffset="0" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3B82F6" strokeWidth="3.5" strokeDasharray="25 100" strokeDashoffset="-57" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10B981" strokeWidth="3.5" strokeDasharray="12 100" strokeDashoffset="-82" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#F59E0B" strokeWidth="3.5" strokeDasharray="6 100" strokeDashoffset="-94" />
                  </svg>
                  
                  <div className="space-y-1.5 text-[9px] font-bold text-slate-600 uppercase">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-xs bg-[#6366F1]"></span>
                      <span>Roads (57%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-xs bg-[#3B82F6]"></span>
                      <span>Tech (25%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-xs bg-[#10B981]"></span>
                      <span>Sani (12%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-xs bg-[#F59E0B]"></span>
                      <span>Infr (6%)</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-[9px] font-semibold text-slate-400 uppercase text-center">Projects Share by Domain</div>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 mb-8 flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Search Initiatives</label>
                <input
                  type="text"
                  placeholder="Search by keywords, team name..."
                  value={sponSearch}
                  onChange={(e) => setSponSearch(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-600"
                />
              </div>
              <div className="w-full md:w-48">
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Category</label>
                <select
                  value={sponCategory}
                  onChange={(e) => setSponCategory(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-2 py-2 text-xs text-slate-700 bg-white"
                >
                  <option value="All">All Categories</option>
                  <option value="Sanitation">Sanitation</option>
                  <option value="Technology">Technology</option>
                  <option value="Infrastructure">Infrastructure</option>
                </select>
              </div>
              <div className="w-full md:w-48">
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Status</label>
                <select
                  value={sponStatus}
                  onChange={(e) => setSponStatus(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-2 py-2 text-xs text-slate-700 bg-white"
                >
                  <option value="All">All Statuses</option>
                  <option value="SEEKING_FUNDING">Seeking Funding</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12 text-slate-600 text-sm font-semibold">Loading initiatives data...</div>
            ) : filteredProjects.length === 0 ? (
              <EmptyState
                iconType="search"
                title="No matching initiatives"
                description="No active student project initiatives matched the selected category or status filters."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <div key={project._id} className="bg-white rounded-xl shadow-md border border-slate-100 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-xs font-semibold border border-blue-100">
                          {project.status.replace("_", " ")}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">{project.title}</h3>
                      <p className="text-sm text-slate-500 mt-1.5">
                        Student Team: <strong className="font-semibold text-slate-700 uppercase">{project.teamName}</strong>
                      </p>

                      <p className="text-xs text-slate-600 mt-3 leading-relaxed font-semibold">
                        {project.description}
                      </p>

                      {/* Modern Progress Bar Segment */}
                      <div className="mt-4 space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold text-slate-600">
                          <span>Project Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${project.progress}%` }}></div>
                        </div>
                      </div>

                      {/* Budget Tracker Segment */}
                      <div className="mt-4 flex justify-between text-xs font-bold border-t border-slate-100 pt-3">
                        <span className="text-slate-500 uppercase">Allocated Budget:</span>
                        <span className="text-slate-800">₹{project.fundingAllocated?.toLocaleString()} / ₹{project.fundingTarget?.toLocaleString()}</span>
                      </div>

                      <div className="mt-5 bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Support Items Required</span>
                        <div className="flex flex-wrap gap-1.5">
                          {project.supportNeeded.length === 0 ? (
                            <span className="text-xs text-slate-400 italic font-medium">No custom requests</span>
                          ) : (
                            project.supportNeeded.map((item) => (
                              <span key={item} className="rounded-full bg-amber-50 text-amber-700 border border-amber-100 px-2.5 py-0.5 text-xs font-semibold uppercase">
                                {item}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                    {project.industryPartner ? (
                      <div className="mt-6 bg-emerald-50 border border-emerald-100 text-emerald-800 p-3 rounded-lg text-xs font-semibold uppercase text-center">
                        🤝 Sponsored by <span className="font-bold text-slate-900">{project.industryPartner}</span>: Allocated {project.industrySupport.join(", ")}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleOpenSupportModal(project)}
                        className="mt-6 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition shadow-sm uppercase tracking-wider text-xs cursor-pointer text-center"
                      >
                        Allocate Sponsorship Support
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Support Modal */}
            {activeProject && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
                <div className="w-full max-w-3xl rounded-xl bg-white p-6 border border-slate-150 shadow-lg">
                  <h3 className="text-base font-black text-[#0B2545] uppercase tracking-wide border-b border-slate-100 pb-2 mb-3 flex items-center justify-between">
                    <span>Allocate CSR Support Pledge</span>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">SIH Validated</span>
                  </h3>
                  <p className="text-xs text-slate-600 font-semibold mb-6 uppercase tracking-tight">Initiative: <strong className="text-slate-800 font-black">"{activeProject.title}"</strong></p>

                  <form onSubmit={handleSubmitSupport} className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-2">1. Organization / Sponsor Name</label>
                      <input
                        type="text"
                        value={partnerName}
                        onChange={(e) => setPartnerName(e.target.value)}
                        placeholder="Enter official Company, NGO or Sponsor Name"
                        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-xs outline-none focus:border-blue-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-3">2. Select Sponsorship Tier</label>
                      <div className="grid gap-4 md:grid-cols-3">
                        {/* Gold Tier Card */}
                        <div 
                          onClick={() => {
                            setSupportItems({ Funding: true, Mentorship: false, Technology: false, Equipment: false });
                          }}
                          className={`rounded-lg p-4 border-2 cursor-pointer transition-all duration-200 text-left flex flex-col justify-between h-40 ${
                            supportItems.Funding && !supportItems.Equipment && !supportItems.Mentorship
                              ? "bg-amber-50/20 border-amber-500 shadow-md ring-1 ring-amber-500" 
                              : "bg-white border-slate-100 hover:border-amber-300 hover:shadow-xs"
                          }`}
                        >
                          <div>
                            <span className="text-[8px] font-black tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 uppercase">Gold Tier</span>
                            <h4 className="font-extrabold text-xs text-[#0B2545] uppercase mt-2">CSR Funding Grant</h4>
                            <p className="text-[10px] text-slate-400 mt-1 leading-normal font-medium">Provide financial grants directly to BITS/IIT student teams for parts & field trials.</p>
                          </div>
                          <span className="text-[9px] font-bold text-amber-600 uppercase mt-auto">Sponsor Funding →</span>
                        </div>

                        {/* Silver Tier Card */}
                        <div 
                          onClick={() => {
                            setSupportItems({ Funding: false, Mentorship: false, Technology: true, Equipment: true });
                          }}
                          className={`rounded-lg p-4 border-2 cursor-pointer transition-all duration-200 text-left flex flex-col justify-between h-40 ${
                            supportItems.Equipment && supportItems.Technology
                              ? "bg-slate-50/50 border-slate-400 shadow-md ring-1 ring-slate-400" 
                              : "bg-white border-slate-100 hover:border-slate-300 hover:shadow-xs"
                          }`}
                        >
                          <div>
                            <span className="text-[8px] font-black tracking-wider text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 uppercase">Silver Tier</span>
                            <h4 className="font-extrabold text-xs text-[#0B2545] uppercase mt-2">Equipment Pledge</h4>
                            <p className="text-[10px] text-slate-400 mt-1 leading-normal font-medium">Pledge hardware sensors, IoT nodes, solar battery cells, or compute hardware.</p>
                          </div>
                          <span className="text-[9px] font-bold text-slate-600 uppercase mt-auto">Pledge Equipment →</span>
                        </div>

                        {/* Community Partner Tier Card */}
                        <div 
                          onClick={() => {
                            setSupportItems({ Funding: false, Mentorship: true, Technology: false, Equipment: false });
                          }}
                          className={`rounded-lg p-4 border-2 cursor-pointer transition-all duration-200 text-left flex flex-col justify-between h-40 ${
                            supportItems.Mentorship && !supportItems.Funding && !supportItems.Equipment
                              ? "bg-orange-50/20 border-orange-400 shadow-md ring-1 ring-orange-400" 
                              : "bg-white border-slate-100 hover:border-orange-200 hover:shadow-xs"
                          }`}
                        >
                          <div>
                            <span className="text-[8px] font-black tracking-wider text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-100 uppercase">Community Partner</span>
                            <h4 className="font-extrabold text-xs text-[#0B2545] uppercase mt-2">Expert Advisory</h4>
                            <p className="text-[10px] text-slate-400 mt-1 leading-normal font-medium">Dedicate standard technology mentors, engineering advisors, or training support.</p>
                          </div>
                          <span className="text-[9px] font-bold text-orange-600 uppercase mt-auto">Pledge Mentorship →</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setActiveProject(null)}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer uppercase"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-lg bg-[#E65C00] text-white px-5 py-2 text-xs font-bold hover:bg-[#C24E00] cursor-pointer uppercase tracking-wider transition-colors"
                      >
                        Register Pledge Support
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* =======================================================
             EXPERT SOLUTION EVALUATION REVIEW PORTAL VIEW
             ======================================================= */
          <div>
            <div className="border-b-2 border-[#0A192F] pb-4 mb-6">
              <h1 className="text-2xl font-black text-[#0A192F] uppercase tracking-wide">
                Expert Evaluation Desk
              </h1>
              <p className="text-xs text-slate-600 mt-1 font-semibold">
                Review academic team prototype solution submissions and submit evaluation feedback.
              </p>
            </div>

            {/* Flat Statistics Bar */}
            <div className="grid gap-4 sm:grid-cols-5 mb-6 text-center text-xs font-bold uppercase tracking-wide">
              <div className="bg-white border border-[#CCCCCC] p-3 rounded-[2px]">
                <span className="text-slate-500 text-[10px] block">Total Solutions</span>
                <p className="text-lg font-black text-[#0A192F] mt-1">{statistics.total}</p>
              </div>
              <div className="bg-blue-50 border border-blue-300 p-3 rounded-[2px] text-blue-800">
                <span className="text-[10px] block">Under Review</span>
                <p className="text-lg font-black mt-1">{statistics.underReview}</p>
              </div>
              <div className="bg-green-50 border border-green-300 p-3 rounded-[2px] text-green-800">
                <span className="text-[10px] block">Approved</span>
                <p className="text-lg font-black mt-1">{statistics.approved}</p>
              </div>
              <div className="bg-amber-50 border border-amber-300 p-3 rounded-[2px] text-amber-800">
                <span className="text-[10px] block">Needs Work</span>
                <p className="text-lg font-black mt-1">{statistics.needsImprovement}</p>
              </div>
              <div className="bg-red-50 border border-red-300 p-3 rounded-[2px] text-red-800">
                <span className="text-[10px] block">Rejected</span>
                <p className="text-lg font-black mt-1">{statistics.rejected}</p>
              </div>
            </div>

            {/* Search & Filters */}
            <div className="bg-white border border-[#CCCCCC] rounded-[2px] p-4 mb-6 flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search by project, student, or technology keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-[2px] border border-[#CCCCCC] px-3 py-2 text-xs outline-none focus:border-[#E65C00]"
                />
              </div>
              <div className="flex gap-2 shrink-0">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-[2px] border border-[#CCCCCC] px-2 py-2 text-xs text-slate-700 bg-white"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="APPROVED">Approved</option>
                  <option value="NEEDS_IMPROVEMENT">Needs Improvement</option>
                  <option value="REJECTED">Rejected</option>
                </select>

                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="rounded-[2px] border border-[#CCCCCC] px-2 py-2 text-xs text-slate-700 bg-white"
                >
                  <option value="NEWEST">Newest First</option>
                  <option value="OLDEST">Oldest First</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12 text-slate-600 text-sm font-semibold">Loading student submissions...</div>
            ) : solutions.length === 0 ? (
              <EmptyState
                iconType="grievance"
                title="No solutions registered"
                description="No academic team prototype solution submissions found in database records."
              />
            ) : filteredSolutions.length === 0 ? (
              <EmptyState
                iconType="search"
                title="No matches found"
                description="No solution reviews matched your search filter criteria."
              />
            ) : (
              <div className="space-y-4">
                {filteredSolutions.map((sol) => (
                  <div key={sol.id} className="border border-[#CCCCCC] bg-white rounded-[2px] p-5">
                    <div className="flex justify-between items-start text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-wide">
                      <span className="text-[#0A192F] font-black">Student Proposal ID: #{sol.id}</span>
                      <span className={`badge-gov border ${getStatusColor(sol.status)}`}>
                        {formatStatus(sol.status)}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-[#0A192F] uppercase tracking-wide">{sol.project_title}</h3>
                    <p className="text-[10px] text-slate-600 font-bold mt-1.5 uppercase">
                      Author: <span className="text-slate-800">{sol.student_name} ({sol.student_email || "No Email Provided"})</span>
                    </p>

                    <div className="mt-4 grid gap-4 md:grid-cols-2 text-xs">
                      <div className="bg-slate-50 border border-[#CCCCCC] p-3 rounded-[2px]">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-wide">Community Problem Description</span>
                        <p className="mt-1.5 text-slate-700 font-medium leading-relaxed">{sol.problem_description}</p>
                      </div>
                      <div className="bg-slate-50 border border-[#CCCCCC] p-3 rounded-[2px]">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-wide">Student Team Proposed Solution</span>
                        <p className="mt-1.5 text-slate-700 font-medium leading-relaxed">{sol.solution_description}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#CCCCCC] flex flex-wrap gap-2 justify-between items-center text-[10px] font-bold">
                      <div className="flex flex-wrap gap-1.5">
                        {sol.technologies && sol.technologies.split(",").map((tech) => (
                          <span key={tech.trim()} className="bg-slate-100 border border-[#CCCCCC] text-slate-700 px-2 py-0.5 rounded-[2px] uppercase">
                            {tech.trim()}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4">
                        {sol.created_at && (
                          <span className="text-slate-500 lowercase font-normal">
                            Submitted {new Date(sol.created_at).toLocaleDateString()}
                          </span>
                        )}
                        <button
                          onClick={() => navigate(`/expert/review/${sol.id}`)}
                          className="bg-[#0A192F] text-white hover:bg-slate-800 px-4 py-1.5 rounded-[2px] uppercase tracking-wide cursor-pointer text-[10px] font-bold"
                        >
                          Review Solution →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
