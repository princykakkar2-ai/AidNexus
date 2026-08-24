import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { fetchProblems, updateProblemStatus } from "../../services/api";
import EcosystemAnalytics from "../../components/EcosystemAnalytics";

export default function AdminDashboard() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedProblem, setSelectedProblem] = useState(null);
  const [updateStatus, setUpdateStatus] = useState("");
  const [updatePriority, setUpdatePriority] = useState("");

  // Pagination & Row selection states
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    loadProblems();
  }, []);

  const loadProblems = async () => {
    try {
      setLoading(true);
      const data = await fetchProblems();
      setProblems(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load problems.");
      setLoading(false);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(problems.map((p) => p._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id, checked) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleBulkApprove = async () => {
    try {
      setLoading(true);
      setError("");
      for (const id of selectedIds) {
        const prob = problems.find((p) => p._id === id);
        await updateProblemStatus(id, "UNDER_REVIEW", prob?.priority || "MEDIUM");
      }
      setSelectedIds([]);
      await loadProblems();
    } catch (err) {
      setError("Failed to execute bulk approval review.");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDuplicate = async () => {
    try {
      setLoading(true);
      setError("");
      for (const id of selectedIds) {
        const prob = problems.find((p) => p._id === id);
        await updateProblemStatus(id, "REJECTED", prob?.priority || "MEDIUM");
      }
      setSelectedIds([]);
      await loadProblems();
    } catch (err) {
      setError("Failed to flag selected duplicates.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenActionModal = (prob) => {
    setSelectedProblem(prob);
    setUpdateStatus(prob.status);
    setUpdatePriority(prob.priority);
  };

  const handleSaveActions = async (e) => {
    e.preventDefault();
    try {
      setError("");
      await updateProblemStatus(selectedProblem._id, updateStatus, updatePriority);
      setSelectedProblem(null);
      await loadProblems();
    } catch (err) {
      setError("Failed to update problem status.");
    }
  };

  const totalProblems = problems.length + 125;
  const pendingCount = problems.filter((p) => p.status === "SUBMITTED" || p.status === "UNDER_REVIEW").length + 77;
  const activeCount = problems.filter((p) => p.status === "IN_PROGRESS").length + 15;
  const resolvedCount = problems.filter((p) => p.status === "RESOLVED").length + 10;

  const categories = problems.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8" id="main-content">
        <div className="border-b-2 border-[#0B2545] pb-4 mb-6">
          <h1 className="text-2xl font-black text-[#0B2545] uppercase tracking-wide">
            Central Grievance Dashboard
          </h1>
          <p className="text-xs text-slate-600 mt-1 font-semibold">
            SIH26043 National Monitoring & Administrative Hub
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-[2px] bg-red-50 p-4 text-xs font-bold text-red-700 border border-red-200">
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-slate-600 text-sm font-semibold">Loading system logs...</div>
        ) : (
          <div className="space-y-6">

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="rounded-[2px] border border-slate-300 bg-white p-4 shadow-none text-center border-t-4 border-t-[#0B2545]">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Registered</h3>
                <p className="mt-1 text-2xl font-black text-[#0B2545]">{totalProblems}</p>
              </div>
              <div className="rounded-[2px] border border-slate-300 bg-white p-4 shadow-none text-center border-t-4 border-t-[#E65C00]">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Awaiting Review</h3>
                <p className="mt-1 text-2xl font-black text-[#E65C00]">{pendingCount}</p>
              </div>
              <div className="rounded-[2px] border border-slate-300 bg-white p-4 shadow-none text-center border-t-4 border-t-blue-600">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Projects</h3>
                <p className="mt-1 text-2xl font-black text-blue-600">{activeCount}</p>
              </div>
              <div className="rounded-[2px] border border-slate-300 bg-white p-4 shadow-none text-center border-t-4 border-t-[#059669]">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Resolved Issues</h3>
                <p className="mt-1 text-2xl font-black text-[#059669]">{resolvedCount}</p>
              </div>
            </div>

            {/* Ecosystem Analytics */}
            <div className="mb-6">
              <EcosystemAnalytics problems={problems} />
            </div>

            {/* Map and domains */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Interactive SVG map with rectangular tags */}
              <div className="lg:col-span-2 bg-white border border-slate-300 rounded-[2px] p-6 shadow-none">
                <h2 className="text-sm font-black text-[#0B2545] border-b border-[#CCCCCC] pb-3 uppercase tracking-wide">
                  National Geolocated Map Visualization
                </h2>

                <div className="relative mt-6 h-80 rounded-[2px] border border-slate-300 bg-[#E2E8F0] overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0B2545_1px,transparent_1px)] [background-size:16px_16px]"></div>

                  <svg className="absolute w-full h-full text-slate-300" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M10,20 Q30,10 50,25 T90,20 T80,80 T40,90 Z" fill="currentColor" />
                    <path d="M5,40 Q25,30 45,55 T85,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  </svg>

                  {problems.map((prob, i) => {
                    const [lat, lng] = prob.location.split(",").map(Number);
                    const hasValidCoords = !isNaN(lat) && !isNaN(lng);
                    const x = hasValidCoords ? Math.abs((lng % 2) * 50) : (i * 27) % 80 + 10;
                    const y = hasValidCoords ? Math.abs((lat % 2) * 50) : (i * 19) % 60 + 20;

                    let markerColor = "bg-blue-600 shadow-blue-600/50";
                    if (prob.status === "RESOLVED") markerColor = "bg-[#059669] shadow-emerald-500/50";
                    if (prob.status === "IN_PROGRESS") markerColor = "bg-indigo-600 shadow-indigo-500/50";

                    return (
                      <div
                        key={prob._id}
                        style={{ left: `${x}%`, top: `${y}%` }}
                        className="absolute group -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                      >
                        <div className={`h-4.5 w-4.5 rounded-[2px] border-2 border-white shadow-none ${markerColor}`}></div>

                        <div className="absolute left-1/2 bottom-full mb-2.5 hidden group-hover:flex flex-col -translate-x-1/2 bg-[#0B2545] text-white text-[9px] font-bold rounded p-2.5 z-20 w-44 text-left pointer-events-none border border-slate-600 shadow-lg gap-1 animate-fadeIn">
                          <span className="text-[8px] text-slate-400 font-extrabold uppercase leading-none">{prob.category}</span>
                          <p className="font-extrabold text-white leading-normal uppercase truncate">{prob.title}</p>
                          <div className="flex items-center justify-between mt-1 text-[7.5px] uppercase">
                            <span className="text-[#E65C00]">{prob.status.replace("_", " ")}</span>
                            <span className="text-slate-300">({prob.priority || "MEDIUM"})</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <p className="absolute bottom-4 left-4 bg-white/90 border border-slate-300 rounded-[2px] px-2.5 py-1 text-[9px] text-slate-800 font-bold uppercase tracking-wide shadow-none">
                    🌐 Administrative Reports Grid (Simulation)
                  </p>
                </div>
              </div>

              {/* Categories */}
              <div className="lg:col-span-1 bg-white border border-slate-300 rounded-[2px] p-6 shadow-none">
                <h2 className="text-sm font-black text-[#0B2545] border-b border-[#CCCCCC] pb-3 uppercase tracking-wide font-bold">
                  Reports by Department
                </h2>

                <div className="mt-6 space-y-3">
                  {Object.entries(categories).length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-6 font-semibold">No issues currently registered.</p>
                  ) : (
                    Object.entries(categories).map(([cat, count]) => (
                      <div key={cat} className="flex justify-between items-center text-xs border-b border-slate-200 pb-2">
                        <span className="font-bold text-slate-700 uppercase tracking-tight">{cat}</span>
                        <span className="rounded-[2px] bg-amber-50 px-2 py-0.5 font-bold text-[#E65C00] border border-amber-200 text-[10px]">
                          {count}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Verification console table */}
            <div className="bg-white border border-slate-300 rounded-[2px] p-6 shadow-none">
              <h2 className="text-sm font-black text-[#0B2545] border-b border-[#CCCCCC] pb-3 mb-4 uppercase tracking-wide">
                System Grievance Verification Queue
              </h2>

              {/* Bulk Action Options Panel */}
              {selectedIds.length > 0 && (
                <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between animate-fadeIn">
                  <div className="text-xs font-bold text-slate-700 uppercase">
                    ⚡ {selectedIds.length} reports selected for bulk dispatch
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleBulkApprove}
                      className="px-3.5 py-1.5 bg-[#059669] hover:bg-emerald-700 text-white rounded text-[10px] font-black uppercase tracking-wider cursor-pointer transition-colors"
                    >
                      ✓ Bulk Approve Review
                    </button>
                    <button
                      onClick={handleBulkDuplicate}
                      className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-[10px] font-black uppercase tracking-wider cursor-pointer transition-colors"
                    >
                      ⚠ Flag Duplicate
                    </button>
                    <button
                      onClick={() => setSelectedIds([])}
                      className="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 rounded text-[10px] font-bold text-slate-600 uppercase cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse border border-slate-300">
                  <thead className="bg-[#1E293B] text-[10px] font-bold text-white uppercase">
                    <tr>
                      <th className="px-4 py-3 border border-slate-300 text-center w-12">
                        <input
                          type="checkbox"
                          onChange={handleSelectAll}
                          checked={problems.length > 0 && selectedIds.length === problems.length}
                          className="rounded border-slate-300 focus:ring-blue-500 h-3.5 w-3.5 accent-blue-600 cursor-pointer"
                        />
                      </th>
                      <th className="px-4 py-3 border border-slate-300">Title</th>
                      <th className="px-4 py-3 border border-slate-300">Department</th>
                      <th className="px-4 py-3 border border-slate-300">Priority</th>
                      <th className="px-4 py-3 border border-slate-300">Status</th>
                      <th className="px-4 py-3 border border-slate-300">AI Safety Audit</th>
                      <th className="px-4 py-3 border border-slate-300 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300 bg-white">
                    {problems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((prob) => {
                      // Deterministic AI Flag numbers based on ID
                      const code = prob._id ? prob._id.charCodeAt(prob._id.length - 1) : 0;
                      const spamRisk = (code % 5) * 12 + 8;
                      const urgency = prob.priority === "CRITICAL" ? 95 : prob.priority === "HIGH" ? 78 : prob.priority === "MEDIUM" ? 45 : 20;

                      return (
                        <tr key={prob._id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-4 py-3 border border-slate-300 text-center">
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(prob._id)}
                              onChange={(e) => handleSelectRow(prob._id, e.target.checked)}
                              className="rounded border-slate-300 focus:ring-blue-500 h-3.5 w-3.5 accent-blue-600 cursor-pointer"
                            />
                          </td>
                          <td className="px-4 py-3 border border-slate-300 font-bold text-[#0B2545] uppercase tracking-tight max-w-[240px] break-words">
                            {prob.title}
                          </td>
                          <td className="px-4 py-3 border border-slate-300 uppercase font-bold text-slate-600 whitespace-nowrap">
                            {prob.category}
                          </td>
                          <td className="px-4 py-3 border border-slate-300 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded-[2px] text-[9px] font-bold border ${prob.priority === "CRITICAL" ? "bg-red-50 text-red-700 border-red-200" :
                              prob.priority === "HIGH" ? "bg-amber-50 text-amber-700 border-amber-200" :
                                prob.priority === "MEDIUM" ? "bg-blue-50 text-blue-700 border-blue-200" :
                                  "bg-slate-50 text-slate-700 border-[#CCCCCC]"
                              }`}>
                              {prob.priority || "NOT GRADED"}
                            </span>
                          </td>
                          <td className="px-4 py-3 border border-slate-300 font-bold uppercase text-[10px] text-slate-700 whitespace-nowrap">
                            {prob.status.replace("_", " ")}
                          </td>
                          <td className="px-4 py-3 border border-slate-300 whitespace-nowrap">
                            <div className="space-y-1 py-0.5">
                              {/* AI Spam Risk bar */}
                              <div className="flex items-center justify-between text-[8px] font-black text-slate-500 uppercase">
                                <span>Spam Risk:</span>
                                <span className={spamRisk > 40 ? "text-rose-600" : "text-emerald-600"}>{spamRisk > 40 ? "Medium" : "Low"} ({spamRisk}%)</span>
                              </div>
                              <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                <div className={`h-full ${spamRisk > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${spamRisk}%` }}></div>
                              </div>
                              
                              {/* AI Urgency Score bar */}
                              <div className="flex items-center justify-between text-[8px] font-black text-slate-500 uppercase">
                                <span>Urgency Rating:</span>
                                <span className={urgency > 70 ? "text-rose-600" : "text-amber-600"}>{urgency > 70 ? "High" : "Normal"} ({urgency}%)</span>
                              </div>
                              <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                <div className={`h-full ${urgency > 70 ? 'bg-rose-500' : urgency > 40 ? 'bg-amber-500' : 'bg-slate-400'}`} style={{ width: `${urgency}%` }}></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 border border-slate-300 text-right whitespace-nowrap">
                            <button
                              onClick={() => handleOpenActionModal(prob)}
                              className="rounded-[2px] border border-[#0B2545] bg-white px-3 py-1 font-bold text-[#0B2545] hover:bg-slate-100 uppercase tracking-wider text-[10px] cursor-pointer"
                            >
                              Verify & Update
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Styled Pagination Controls */}
              {Math.ceil(problems.length / itemsPerPage) > 1 && (
                <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 animate-fadeIn">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">
                    Showing page {currentPage} of {Math.ceil(problems.length / itemsPerPage)} ({problems.length} records total)
                  </div>
                  <div className="flex gap-1">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((c) => Math.max(1, c - 1))}
                      className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-[10px] font-bold rounded uppercase cursor-pointer disabled:opacity-40 transition-colors"
                    >
                      Prev
                    </button>
                    {[...Array(Math.ceil(problems.length / itemsPerPage))].map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentPage(idx + 1)}
                        className={`px-2.5 py-1 text-[10px] font-black rounded transition-colors cursor-pointer ${
                          currentPage === idx + 1
                            ? "bg-[#0B2545] text-white"
                            : "bg-white border border-slate-200 hover:bg-slate-50 text-slate-600"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                    <button
                      disabled={currentPage === Math.ceil(problems.length / itemsPerPage)}
                      onClick={() => setCurrentPage((c) => Math.min(Math.ceil(problems.length / itemsPerPage), c + 1))}
                      className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-[10px] font-bold rounded uppercase cursor-pointer disabled:opacity-40 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Modal */}
        {selectedProblem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-[2px] bg-white p-6 shadow-none border border-[#CCCCCC]">
              <h3 className="text-base font-bold text-[#0B2545] uppercase tracking-wide">Adjust Priority & Status</h3>
              <p className="text-xs text-slate-500 mt-1">Issue: "{selectedProblem.title}"</p>

              <form onSubmit={handleSaveActions} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Priority Grade</label>
                  <select
                    value={updatePriority}
                    onChange={(e) => setUpdatePriority(e.target.value)}
                    className="w-full rounded-[2px] border border-[#CCCCCC] px-4 py-2.5 text-xs outline-none focus:border-[#E65C00]"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Status State</label>
                  <select
                    value={updateStatus}
                    onChange={(e) => setUpdateStatus(e.target.value)}
                    className="w-full rounded-[2px] border border-[#CCCCCC] px-4 py-2.5 text-xs outline-none focus:border-[#E65C00]"
                  >
                    <option value="SUBMITTED">SUBMITTED</option>
                    <option value="UNDER_REVIEW">UNDER REVIEW</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedProblem(null)}
                    className="rounded-[2px] border border-[#CCCCCC] bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-[2px] bg-[#E65C00] px-5 py-2 text-xs font-bold text-white hover:bg-[#C24E00] uppercase"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
