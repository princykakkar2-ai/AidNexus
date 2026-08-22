export default function ProblemCard({ problem }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {problem.image && <img src={`http://localhost:5000${problem.image}`} alt="Problem" className="mb-4 h-48 w-full rounded-xl object-cover" />}
      <h3 className="text-xl font-bold text-slate-900">{problem.title}</h3>
      <p className="mt-2 text-sm text-slate-600">{problem.description}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-slate-100 px-3 py-1">{problem.category}</span>
        <span className="rounded-full bg-slate-100 px-3 py-1">{problem.priority}</span>
        <span className="rounded-full bg-slate-100 px-3 py-1">{problem.status}</span>
      </div>
      <p className="mt-3 text-sm text-slate-500">📍 {problem.location}</p>
    </article>
  );
}
