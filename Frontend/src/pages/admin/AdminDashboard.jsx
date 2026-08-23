import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { fetchProblems, updateProblemStatus } from "../../services/api";

export default function AdminDashboard() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedProblem, setSelectedProblem] = useState(null);
  const [updateStatus, setUpdateStatus] = useState("");
  const [updatePriority, setUpdatePriority] = useState("");

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

  const totalProblems = problems.length;
  const pendingCount = problems.filter((p) => p.status === "SUBMITTED" || p.status === "UNDER_REVIEW").length;
  const activeCount = problems.filter((p) => p.status === "IN_PROGRESS").length;
  const resolvedCount = problems.filter((p) => p.status === "RESOLVED").length;

  const categories = problems.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="border-b border-slate-200 pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0F172A]">Central Grievance Dashboard</h1>
          <p className="mt-1 text-xs font-semibold text-slate-600 uppercase tracking-wider">SIH26043 National Monitoring & Administrative Hub</p>
        </div>

        {error && (
          <div className="mt-6 rounded-[4px] bg-red-50 p-4 text-xs font-bold text-red-700 border border-red-200">{error}</div>
        )}

        {loading ? (
          <div className="mt-12 text-center text-slate-600 text-sm font-semibold">Loading system logs...</div>
        ) : (
          <div className="mt-8 space-y-8">
            
            {/* Stats Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-[6px] border border-slate-200 bg-white p-6 shadow-sm text-center border-t-4 border-t-[#0F172A]">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Registered</h3>
                <p className="mt-2 text-3xl font-black text-[#0F172A]">{totalProblems}</p>
              </div>
              <div className="rounded-[6px] border border-slate-200 bg-white p-6 shadow-sm text-center border-t-4 border-t-[#D97706]">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Awaiting Review</h3>
                <p className="mt-2 text-3xl font-black text-[#D97706]">{pendingCount}</p>
              </div>
              <div className="rounded-[6px] border border-slate-200 bg-white p-6 shadow-sm text-center border-t-4 border-t-indigo-600">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Projects</h3>
                <p className="mt-2 text-3xl font-black text-indigo-600">{activeCount}</p>
              </div>
              <div className="rounded-[6px] border border-slate-200 bg-white p-6 shadow-sm text-center border-t-4 border-t-[#059669]">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Resolved Issues</h3>
                <p className="mt-2 text-3xl font-black text-[#059669]">{resolvedCount}</p>
              </div>
            </div>

            {/* Map and domains */}
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Interactive SVG map with rectangular tags */}
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[6px] p-6 shadow-sm">
                <h2 className="text-base font-bold text-[#0F172A] border-b border-slate-100 pb-3 uppercase tracking-wider">National Geolocated Map Visualization</h2>
                
                <div className="relative mt-6 h-80 rounded-[4px] border border-slate-200 bg-[#E2E8F0] overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0F172A_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  
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
                        <div className={`h-4.5 w-4.5 rounded-[4px] border-2 border-white shadow-md ${markerColor}`}></div>
                        
                        <div className="absolute left-1/2 bottom-full mb-2 hidden group-hover:block -translate-x-1/2 bg-[#0F172A] text-white text-[9px] font-bold rounded-[4px] p-2 z-10 w-28 text-center pointer-events-none border border-slate-700">
                          <p className="truncate uppercase">{prob.title}</p>
                          <p className="text-[8px] text-[#D97706] mt-0.5">{prob.status}</p>
                        </div>
                      </div>
                    );
                  })}
                  <p className="absolute bottom-4 left-4 bg-white/90 border border-slate-200 rounded-[4px] px-2.5 py-1 text-[9px] text-slate-800 font-bold uppercase tracking-wide shadow-sm">
                    🌐 Administrative Reports Grid (Simulation)
                  </p>
                </div>
              </div>

              {/* Categories */}
              <div className="lg:col-span-1 bg-white border border-slate-200 rounded-[6px] p-6 shadow-sm">
                <h2 className="text-base font-bold text-[#0F172A] border-b border-slate-100 pb-3 uppercase tracking-wider">Reports by Department</h2>
                
                <div className="mt-6 space-y-4">
                  {Object.entries(categories).length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-6 font-semibold">No issues currently registered.</p>
                  ) : (
                    Object.entries(categories).map(([cat, count]) => (
                      <div key={cat} className="flex justify-between items-center text-xs border-b border-slate-100 pb-2">
                        <span className="font-bold text-slate-700 uppercase">{cat}</span>
                        <span className="rounded-[4px] bg-[#FFFBEB] px-2 py-0.5 font-bold text-[#D97706] border border-amber-200">
                          {count}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Verification console table */}
            <div className="bg-white border border-slate-200 rounded-[6px] p-6 shadow-sm">
              <h2 className="text-base font-bold text-[#0F172A] border-b border-slate-100 pb-3 uppercase tracking-wider">System Grievance verification queue</h2>
              
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-700 uppercase border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3">Title</th>
                      <th className="px-6 py-3">Department</th>
                      <th className="px-6 py-3">Priority</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Coordinates</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {problems.map((prob) => (
                      <tr key={prob._id} className="bg-white hover:bg-slate-50">
                        <td className="px-6 py-4 font-bold text-[#0F172A] uppercase">{prob.title}</td>
                        <td className="px-6 py-4 uppercase font-semibold text-slate-500">{prob.category}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded-[4px] text-[9px] font-bold border ${
                            prob.priority === "CRITICAL" ? "bg-red-50 text-red-700 border-red-200" :
                            prob.priority === "HIGH" ? "bg-amber-50 text-amber-700 border-amber-200" :
                            prob.priority === "MEDIUM" ? "bg-blue-50 text-blue-700 border-blue-200" :
                            "bg-slate-50 text-slate-700 border-slate-200"
                          }`}>
                            {prob.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold">
                          <span className="uppercase text-[10px]">{prob.status.replace("_", " ")}</span>
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-400">{prob.location}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleOpenActionModal(prob)}
                            className="rounded-[4px] border border-[#0F172A] bg-white px-3 py-1 font-bold text-[#0F172A] hover:bg-slate-50 uppercase tracking-wider text-[10px]"
                          >
                            Verify & Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Action Modal */}
        {selectedProblem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-[6px] bg-white p-6 shadow-xl border border-slate-200">
              <h3 className="text-base font-bold text-[#0F172A] uppercase tracking-wide">Adjust Priority & Status</h3>
              <p className="text-xs text-slate-500 mt-1">Issue: "{selectedProblem.title}"</p>

              <form onSubmit={handleSaveActions} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Priority Grade</label>
                  <select
                    value={updatePriority}
                    onChange={(e) => setUpdatePriority(e.target.value)}
                    className="w-full rounded-[4px] border border-slate-300 px-4 py-2.5 text-xs outline-none focus:border-[#D97706]"
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
                    className="w-full rounded-[4px] border border-slate-300 px-4 py-2.5 text-xs outline-none focus:border-[#D97706]"
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
                    className="rounded-[4px] border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-[4px] bg-[#D97706] px-5 py-2 text-xs font-bold text-white hover:bg-[#B45309] uppercase"
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
