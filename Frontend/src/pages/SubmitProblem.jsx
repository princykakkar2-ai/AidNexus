import Navbar from "../components/Navbar";
import ProblemForm from "../components/ProblemForm";

export default function SubmitProblem() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight uppercase">Register Civic Grievance</h1>
          <p className="mt-2 text-xs font-semibold text-slate-500 uppercase tracking-widest">
            Enter detailed information to submit a public report.
          </p>
        </div>
        <div className="card-gov p-6 bg-white border border-slate-200">
          <ProblemForm />
        </div>
      </main>
    </div>
  );
}
