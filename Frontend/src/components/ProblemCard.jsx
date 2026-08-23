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
        <span className="text-slate-500 uppercase">
          PRIORITY: <strong className="text-[#0B2545]">{problem.priority}</strong>
        </span>
      </div>
    </article>
  );
}
