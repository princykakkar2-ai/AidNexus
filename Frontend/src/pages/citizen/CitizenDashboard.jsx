import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import EmptyState from "../../components/EmptyState";
import { fetchProblems } from "../../services/api";
import { CANONICAL_PROBLEMS } from "../../data/canonicalProblems";

export default function CitizenDashboard() {
  const [problems, setProblems] = useState(CANONICAL_PROBLEMS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProblems()
      .then((data) => {
        if (data && data.length > 0) {
          const combined = [...data];
          CANONICAL_PROBLEMS.forEach((cp) => {
            if (!combined.some((p) => (p._id || p.id) === (cp._id || cp.id))) {
              combined.push(cp);
            }
          });
          setProblems(combined);
        } else {
          setProblems(CANONICAL_PROBLEMS);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Using canonical problems for citizen dashboard:", err);
        setProblems(CANONICAL_PROBLEMS);
        setLoading(false);
      });
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "SUBMITTED":
      case "UNDER_REVIEW":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "RESOLVED":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "REJECTED":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#CCCCCC] pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#0B2545]">Citizen Grievance Console</h1>
            <p className="mt-1 text-xs font-semibold text-slate-600 uppercase tracking-wider">National Civic Problems Registration Portal</p>
          </div>
          <div>
            <Link
              to="/submit-problem"
              className="inline-flex rounded-[2px] bg-[#E65C00] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#C24E00] shadow-none transition-colors"
            >
              + REGISTER NEW GRIEVANCE
            </Link>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-[2px] bg-red-50 p-4 text-xs font-bold text-red-700 border border-red-200">{error}</div>
        )}

        {loading ? (
          <div className="mt-12 text-center text-slate-600 text-sm font-semibold">Loading logged reports from database...</div>
        ) : problems.length === 0 ? (
          <EmptyState
            iconType="grievance"
            title="No grievances registered yet"
            description="Report public service issues, road blockages, or infrastructure failures directly to administration officials to get started."
            actionText="Register Now"
            actionLink="/submit-problem"
          />
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {problems.map((problem) => (
              <div
                key={problem._id}
                className="flex flex-col rounded-[2px] border border-[#CCCCCC] bg-white p-6 shadow-none hover:shadow-none transition-colors border-l-4 border-l-[#E65C00]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">📍 Location: {problem.location}</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase border tracking-wider shrink-0 ${getStatusColor(problem.status)}`}
                  >
                    {problem.status.replace("_", " ")}
                  </span>
                </div>

                <h3 className="mt-4 text-base font-bold text-[#0B2545]">{problem.title}</h3>
                <p className="mt-2 flex-1 text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {problem.description}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-[#CCCCCC] pt-4 text-[10px] font-bold">
                  <span className="bg-slate-100 border border-[#CCCCCC] px-2 py-0.5 rounded-[2px] text-slate-700 uppercase">
                    {problem.category}
                  </span>
                  <div className="flex items-center gap-1.5 uppercase text-slate-500">
                    <span>PRIORITY:</span>
                    <span className={`px-2 py-0.5 rounded-[2px] text-[9px] font-bold border ${
                      (problem.priority || "").toUpperCase() === "CRITICAL" || (problem.priority || "").toUpperCase() === "HIGH"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : (problem.priority || "").toUpperCase() === "MEDIUM"
                          ? "bg-orange-50 text-orange-700 border-orange-200"
                          : (problem.priority || "").toUpperCase() === "LOW"
                            ? "bg-yellow-50 text-yellow-800 border-yellow-300"
                            : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}>
                      {problem.priority || "MEDIUM"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
