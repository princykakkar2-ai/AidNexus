import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { fetchProblems } from "../../services/api";

export default function CitizenDashboard() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProblems()
      .then((data) => {
        setProblems(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load reported problems.");
        setLoading(false);
      });
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "SUBMITTED":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "UNDER_REVIEW":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "IN_PROGRESS":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "RESOLVED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "REJECTED":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#0F172A]">Citizen Grievance Console</h1>
            <p className="mt-1 text-xs font-semibold text-slate-600 uppercase tracking-wider">National Civic Problems Registration Portal</p>
          </div>
          <div>
            <Link
              to="/submit-problem"
              className="inline-flex rounded-[4px] bg-[#D97706] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#B45309] shadow-sm transition-all"
            >
              + REGISTER NEW GRIEVANCE
            </Link>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-[4px] bg-red-50 p-4 text-xs font-bold text-red-700 border border-red-200">{error}</div>
        )}

        {loading ? (
          <div className="mt-12 text-center text-slate-600 text-sm font-semibold">Loading logged reports from database...</div>
        ) : problems.length === 0 ? (
          <div className="mt-12 text-center rounded-[6px] border border-dashed border-slate-300 p-12 bg-white shadow-sm">
            <span className="text-4xl">📝</span>
            <h3 className="mt-4 text-base font-bold text-[#0F172A]">No grievances registered</h3>
            <p className="mt-2 text-xs text-slate-500">Report public service issues, road blockages, or infrastructure failures directly to officials.</p>
            <Link
              to="/submit-problem"
              className="mt-6 inline-flex rounded-[4px] bg-[#D97706] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#B45309]"
            >
              REGISTER NOW
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {problems.map((problem) => (
              <div
                key={problem._id}
                className="flex flex-col rounded-[6px] border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all border-l-4 border-l-[#D97706]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">📍 Location: {problem.location}</span>
                  <span
                    className={`badge-gov border ${getStatusColor(problem.status)}`}
                  >
                    {problem.status.replace("_", " ")}
                  </span>
                </div>

                <h3 className="mt-4 text-base font-bold text-[#0F172A]">{problem.title}</h3>
                <p className="mt-2 flex-1 text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {problem.description}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-[10px] font-bold">
                  <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-[4px] text-slate-700 uppercase">
                    {problem.category}
                  </span>
                  <span className="text-slate-500">
                    PRIORITY: <strong className="text-slate-800 uppercase">{problem.priority}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
