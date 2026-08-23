import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { fetchProjects, offerProjectSupport } from "../../services/api";

export default function ExpertDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [activeProject, setActiveProject] = useState(null); // Project for the modal
  const [partnerName, setPartnerName] = useState("");
  const [supportItems, setSupportItems] = useState({
    Funding: false,
    Mentorship: false,
    Technology: false,
    Equipment: false,
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await fetchProjects();
      setProjects(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load active projects.");
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

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="border-b border-[#CCCCCC] pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0B2545]">Industry & NGO Sponsorship Hub</h1>
          <p className="mt-1 text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Review academic team initiatives and sponsor resources to support community project resolutions.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-[2px] bg-red-50 p-4 text-xs font-bold text-red-700 border border-red-200">{error}</div>
        )}
        {success && (
          <div className="mt-6 rounded-[2px] bg-green-50 p-4 text-xs font-bold text-green-700 border border-green-200">{success}</div>
        )}

        {loading ? (
          <div className="mt-12 text-center text-slate-600 text-sm font-semibold">Loading academic initiatives...</div>
        ) : projects.length === 0 ? (
          <div className="mt-12 text-center text-slate-500 py-12 bg-white rounded-[2px] border border-[#CCCCCC] shadow-none">
            <span className="text-3xl">🤝</span>
            <p className="mt-2 text-xs font-bold text-slate-600 uppercase tracking-wider">No active projects registered</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <div
                key={project._id}
                className="flex flex-col rounded-[2px] border border-[#CCCCCC] bg-white p-6 shadow-none hover:shadow-none transition-colors border-l-4 border-l-[#E65C00]"
              >
                <div className="flex items-center justify-between">
                  <span className="badge-gov bg-slate-50 border border-[#CCCCCC] text-slate-700">
                    {project.status.replace("_", " ")}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">Progress: {project.progress}% Complete</span>
                </div>

                <h3 className="mt-4 text-base font-bold text-[#0B2545] uppercase">{project.title}</h3>
                <p className="mt-1 text-xs text-slate-600">
                  Assigned Team: <strong className="font-bold text-slate-800 uppercase">{project.teamName}</strong>
                </p>

                <div className="mt-4 bg-slate-50 rounded-[2px] p-4 border border-[#CCCCCC] flex-1">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Support Items Required</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {project.supportNeeded.length === 0 ? (
                      <span className="text-xs text-slate-400">None requested</span>
                    ) : (
                      project.supportNeeded.map((item) => (
                        <span key={item} className="rounded-[2px] bg-amber-50 border border-amber-200 text-amber-800 px-2 py-0.5 text-[10px] font-bold uppercase">
                          {item}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {project.industryPartner ? (
                  <div className="mt-6 bg-emerald-50 border border-emerald-100 rounded-[2px] p-4 text-xs text-emerald-800 font-medium">
                    🤝 SPONSORED BY <strong className="font-bold text-[#0B2545]">{project.industryPartner}</strong>: Provided {project.industrySupport.join(", ")}.
                  </div>
                ) : (
                  <div className="mt-6">
                    <button
                      onClick={() => handleOpenSupportModal(project)}
                      className="w-full rounded-[2px] bg-[#E65C00] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#C24E00] shadow-none transition-colors uppercase tracking-wider"
                    >
                      Offer Collaboration & Support
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Support Modal */}
        {activeProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-[2px] bg-white p-6 shadow-none border border-[#CCCCCC]">
              <h3 className="text-lg font-bold text-[#0B2545] uppercase tracking-wide">Register Support Offer</h3>
              <p className="text-xs text-slate-500 mt-1">Initiative: "{activeProject.title}"</p>

              <form onSubmit={handleSubmitSupport} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Organization / Sponsor Name</label>
                  <input
                    type="text"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    placeholder="Enter Company, NGO or Sponsor Name"
                    className="w-full rounded-[2px] border border-[#CCCCCC] px-4 py-2.5 text-xs outline-none focus:border-[#E65C00]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Select Support Type(s) to Allocate</label>
                  <div className="space-y-2">
                    {Object.keys(supportItems).map((name) => (
                      <label key={name} className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer uppercase">
                        <input
                          type="checkbox"
                          checked={supportItems[name]}
                          onChange={() => handleCheckboxChange(name)}
                          className="h-4 w-4 rounded border-[#CCCCCC] text-teal-600 focus:ring-teal-500"
                        />
                        {name}
                      </label>
                    ))}
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-[2px] border border-red-200">{error}</p>
                )}

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveProject(null)}
                    className="rounded-[2px] border border-[#CCCCCC] bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="rounded-[2px] bg-[#E65C00] px-5 py-2 text-xs font-bold text-white hover:bg-[#C24E00]"
                  >
                    SUBMIT SPONSORSHIP
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
