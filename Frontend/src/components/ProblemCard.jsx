export default function ProblemCard({ problem }) {
  return (
    <article className="rounded-[6px] border border-slate-200 bg-white p-6 shadow-sm border-l-4 border-l-[#D97706]">
      {problem.image && (
        <img
          src={`http://localhost:5000${problem.image}`}
          alt="Problem Evidence"
          className="mb-4 h-64 w-full rounded-[4px] object-cover border border-slate-200"
        />
      )}
      <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 mb-2">
        <span>📍 {problem.location}</span>
        <span className="bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-0.5 rounded-[4px] uppercase">
          {problem.status.replace("_", " ")}
        </span>
      </div>

      <h3 className="text-xl font-extrabold text-[#0F172A] uppercase tracking-wide">{problem.title}</h3>
      <p className="mt-3 text-xs text-slate-600 leading-relaxed">{problem.description}</p>
      
      <div className="mt-6 flex flex-wrap gap-2 text-[10px] font-bold border-t border-slate-100 pt-4 justify-between items-center">
        <span className="rounded-[4px] bg-[#FFFBEB] text-[#D97706] border border-amber-200 px-3 py-1 uppercase">
          {problem.category}
        </span>
        <span className="text-slate-500 uppercase">
          PRIORITY: <strong className="text-[#0F172A]">{problem.priority}</strong>
        </span>
      </div>
    </article>
  );
}
