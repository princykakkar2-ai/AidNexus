import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { fetchProblems, fetchProjects, createProject, updateProjectProgress } from "../../services/api";

export default function StudentDashboard() {
  const [problems, setProblems] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const teamName = "Team Innovators ABC"; // Simulated student team

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const problemsData = await fetchProblems();
      const projectsData = await fetchProjects();
      
      const acceptedProblemIds = projectsData.map((p) => p.problemId);
      const availableProblems = problemsData.filter((p) => !acceptedProblemIds.includes(p._id));
      
      setProblems(availableProblems);
      setProjects(projectsData);
      setLoading(false);
    } catch (err) {
      setError("Failed to load student dashboard data.");
      setLoading(false);
    }
  };

  const handleAcceptProblem = async (problem) => {
    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      await createProject(problem._id, problem.title, teamName, ["Funding", "Mentorship"]);
      setSuccess(`Successfully accepted "${problem.title}"! Project created.`);
      await loadDashboardData();
    } catch (err) {
      setError("Failed to accept problem.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateProgress = async (projectId, currentProgress) => {
    try {
      const nextProgress = Math.min(currentProgress + 10, 100);
      const status = nextProgress === 100 ? "COMPLETED" : "IN_PROGRESS";
      setError("");
      
      await updateProjectProgress(projectId, nextProgress, status);
      await loadDashboardData();
    } catch (err) {
      setError("Failed to update project progress.");
    }
  };

  const getMatchScore = (category) => {
    switch (category) {
      case "Infrastructure":
        return 91;
      case "Environment":
        return 84;
      case "Transportation":
        return 76;
      case "Electricity":
        return 88;
      default:
        return 65;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="border-b border-slate-200 pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0F172A]">Academic Innovation Panel</h1>
          <p className="mt-1 text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Assigned Student Group: <strong className="text-[#D97706] font-bold">{teamName}</strong>
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-[4px] bg-red-50 p-4 text-xs font-bold text-red-700 border border-red-200">{error}</div>
        )}
        {success && (
          <div className="mt-6 rounded-[4px] bg-green-50 p-4 text-xs font-bold text-green-700 border border-green-200">{success}</div>
        )}

        {loading ? (
          <div className="mt-12 text-center text-slate-600 text-sm font-semibold">Loading academic workspace...</div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            {/* Recommended Problems column */}
            <div className="lg:col-span-1 bg-white border border-slate-200 rounded-[6px] p-6 shadow-sm">
              <h2 className="text-base font-bold text-[#0F172A] border-b border-slate-100 pb-3 uppercase tracking-wider">
                Matching Recommendations
              </h2>
              
              <div className="mt-4 space-y-4">
                {problems.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-6 font-semibold">No matched demands available.</p>
                ) : (
                  problems.map((problem) => {
                    const score = getMatchScore(problem.category);
                    return (
                      <div
                        key={problem._id}
                        className="rounded-[4px] border border-slate-200 bg-slate-50/50 p-4 hover:border-[#D97706] transition-all"
                      >
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                          <span>📍 {problem.location}</span>
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-[4px] border border-emerald-100 uppercase">
                            ★ {score}% MATCH
                          </span>
                        </div>
                        <h4 className="font-bold text-[#0F172A] mt-2 text-xs uppercase">{problem.title}</h4>
                        <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">{problem.description}</p>
                        
                        <div className="mt-4 flex items-center justify-between text-[10px] font-bold">
                          <span className="bg-slate-100 border border-slate-200 rounded-[4px] px-2 py-0.5 text-slate-700 uppercase">
                            {problem.category}
                          </span>
                          <button
                            onClick={() => handleAcceptProblem(problem)}
                            disabled={actionLoading}
                            className="rounded-[4px] bg-[#D97706] px-2.5 py-1 text-[10px] text-white hover:bg-[#B45309] font-bold disabled:opacity-50"
                          >
                            ACCEPT PROJECT
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* My Active Projects column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-slate-200 rounded-[6px] p-6 shadow-sm">
                <h2 className="text-base font-bold text-[#0F172A] border-b border-slate-100 pb-3 uppercase tracking-wider">
                  Active Projects Workspace
                </h2>

                <div className="mt-6 space-y-6">
                  {projects.filter(p => p.teamName === teamName).length === 0 ? (
                    <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-[4px] border border-dashed border-slate-300">
                      <span className="text-3xl">🚀</span>
                      <p className="mt-2 text-xs font-bold text-slate-600 uppercase tracking-wider">No active projects registered</p>
                      <p className="text-[10px] text-slate-400 mt-1">Accept a grievance request on the left to start collaborating.</p>
                    </div>
                  ) : (
                    projects
                      .filter((p) => p.teamName === teamName)
                      .map((project) => (
                        <div key={project._id} className="rounded-[4px] border border-slate-200 p-5 bg-white shadow-sm border-l-4 border-l-[#0F172A]">
                          <div className="flex justify-between items-start gap-4 flex-wrap">
                            <div>
                              <h3 className="font-bold text-[#0F172A] text-sm uppercase">{project.title}</h3>
                              <p className="text-[10px] text-slate-500 mt-1 font-semibold">
                                STATUS: <span className="text-indigo-700 uppercase">{project.status.replace("_", " ")}</span>
                              </p>
                            </div>
                            <span className="text-[10px] bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-[4px] font-bold text-slate-700 uppercase">
                              Required: {project.supportNeeded.join(", ")}
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className="mt-6">
                            <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                              <span>Milestone Progress</span>
                              <span>{project.progress}% Complete</span>
                            </div>
                            <div className="h-2 w-full rounded-[4px] bg-slate-100 overflow-hidden border border-slate-200">
                              <div
                                style={{ width: `${project.progress}%` }}
                                className="h-full bg-[#0F172A] transition-all duration-300"
                              ></div>
                            </div>
                          </div>

                          {/* Industry support status */}
                          <div className="mt-4 bg-[#FFFBEB] rounded-[4px] p-3 border border-amber-200 text-xs leading-relaxed">
                            {project.industryPartner ? (
                              <p className="text-amber-800">
                                🤝 Supported by <strong className="font-bold text-[#0F172A]">{project.industryPartner}</strong>: Offers {project.industrySupport.join(", ")}.
                              </p>
                            ) : (
                              <p className="text-amber-700 font-medium">
                                ⏳ Pending Sponsorship: Waiting for Industry / NGO sponsors to check support items.
                              </p>
                            )}
                          </div>

                          <div className="mt-4 flex justify-end gap-3">
                            <button
                              onClick={() => handleUpdateProgress(project._id, project.progress)}
                              disabled={project.progress === 100}
                              className="rounded-[4px] bg-[#0f172a] px-4 py-1.5 text-[10px] font-bold text-white hover:bg-slate-800 disabled:opacity-50 uppercase tracking-wider"
                            >
                              {project.progress === 100 ? "Project Completed" : "Increment Progress +10%"}
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
