export default function ProblemCard({ problem }) {
  return (
    <article className="rounded-[2px] border border-[#CCCCCC] bg-white p-6 shadow-none border-l-4 border-l-[#E65C00]">
      {problem.image && (
        <img
          src={`http://localhost:5000${problem.image}`}
          alt="Problem Evidence"
          className="mb-4 h-64 w-full rounded-[2px] object-cover border border-[#CCCCCC]"
        />
      )}
      <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 mb-2">
        <span>📍 {problem.location}</span>
        <span className="bg-slate-100 border border-[#CCCCCC] text-slate-700 px-2.5 py-0.5 rounded-[2px] uppercase">
          {problem.status.replace("_", " ")}
        </span>
      </div>

      <h3 className="text-xl font-extrabold text-[#0B2545] uppercase tracking-wide">{problem.title}</h3>
      <p className="mt-3 text-xs text-slate-600 leading-relaxed">{problem.description}</p>
      
      <div className="mt-6 flex flex-wrap gap-2 text-[10px] font-bold border-t border-[#CCCCCC] pt-4 justify-between items-center">
        <span className="rounded-[2px] bg-[#FFFBEB] text-[#E65C00] border border-amber-200 px-3 py-1 uppercase">
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
    </article>
  );
}
