import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
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
          /* =======================================================
             INDUSTRY & NGO SPONSORSHIP PORTAL VIEW
             ======================================================= */
          <div>
            <div className="border-b-2 border-[#0A192F] pb-4 mb-6">
              <h1 className="text-2xl font-black text-[#0A192F] uppercase tracking-wide">
                Industry & NGO Sponsorship Hub
              </h1>
              <p className="text-xs text-slate-600 mt-1 font-semibold">
                Review active student project initiatives and allocate sponsorship support.
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12 text-slate-600 text-sm font-semibold">Loading initiatives data...</div>
            ) : projects.length === 0 ? (
              <div className="border border-[#CCCCCC] rounded-[2px] p-12 text-center text-slate-500 font-semibold bg-white">
                🤝 No active student project initiatives awaiting sponsorship.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {projects.map((project) => (
                  <div key={project._id} className="card-gov p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 mb-3 uppercase">
                        <span className="bg-slate-100 border border-[#CCCCCC] text-slate-700 px-2 py-0.5 rounded-[2px]">
                          {project.status.replace("_", " ")}
                        </span>
                        <span>Progress: {project.progress}%</span>
                      </div>
                      
                      <h3 className="font-extrabold text-[#0A192F] text-sm uppercase tracking-wide">{project.title}</h3>
                      <p className="text-[10px] text-slate-600 mt-1">
                        Student Team: <strong className="font-bold text-slate-800 uppercase">{project.teamName}</strong>
                      </p>

                      <div className="mt-4 bg-slate-50 border border-[#CCCCCC] rounded-[2px] p-3">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-wide">Support Items Required</span>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {project.supportNeeded.length === 0 ? (
                            <span className="text-[10px] text-slate-500 font-semibold italic">No custom requests</span>
                          ) : (
                            project.supportNeeded.map((item) => (
                              <span key={item} className="text-[9px] font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-[2px]">
                                {item}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                    {project.industryPartner ? (
                      <div className="mt-5 bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-[2px] text-[10px] font-bold uppercase">
                        🤝 Sponsored by <span className="text-[#0A192F]">{project.industryPartner}</span>: Allocated {project.industrySupport.join(", ")}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleOpenSupportModal(project)}
                        className="mt-5 w-full bg-[#E65C00] text-white py-2 text-xs font-bold rounded-[2px] uppercase tracking-wider hover:bg-[#B34700] transition-colors cursor-pointer"
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
                <div className="w-full max-w-md rounded-[2px] bg-white p-6 border border-[#CCCCCC] shadow-none">
                  <h3 className="text-base font-black text-[#0A192F] uppercase tracking-wide border-b border-[#CCCCCC] pb-2 mb-3">
                    Register Sponsorship Support Offer
                  </h3>
                  <p className="text-[11px] text-slate-600 font-semibold mb-4">Project: "{activeProject.title}"</p>

                  <form onSubmit={handleSubmitSupport} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Organization / Sponsor Name</label>
                      <input
                        type="text"
                        value={partnerName}
                        onChange={(e) => setPartnerName(e.target.value)}
                        placeholder="Enter Company, NGO or Sponsor Name"
                        className="w-full rounded-[2px] border border-[#CCCCCC] px-3 py-2 text-xs outline-none focus:border-[#E65C00]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-2">Select Support Type(s) to Allocate</label>
                      <div className="space-y-2 bg-slate-50 p-3 border border-[#CCCCCC] rounded-[2px]">
                        {Object.keys(supportItems).map((name) => (
                          <label key={name} className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer uppercase select-none">
                            <input
                              type="checkbox"
                              checked={supportItems[name]}
                              onChange={() => handleCheckboxChange(name)}
                              className="h-4 w-4 border-[#CCCCCC] text-[#E65C00] rounded-[2px] focus:ring-[#E65C00]"
                            />
                            {name}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-[#CCCCCC]">
                      <button
                        type="button"
                        onClick={() => setActiveProject(null)}
                        className="rounded-[2px] border border-[#CCCCCC] bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-[2px] bg-[#E65C00] text-white px-5 py-2 text-xs font-bold hover:bg-[#B34700] cursor-pointer"
                      >
                        Register Offer
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
              <div className="border border-[#CCCCCC] rounded-[2px] p-12 text-center text-slate-500 font-semibold bg-white">
                📋 No solution submissions found in records.
              </div>
            ) : filteredSolutions.length === 0 ? (
              <div className="border border-[#CCCCCC] rounded-[2px] p-12 text-center text-slate-500 font-semibold bg-white">
                🔎 No solution reviews matches your search filter query.
              </div>
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
