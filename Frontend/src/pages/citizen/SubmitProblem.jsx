import Navbar from "../../components/Navbar";
import ProblemForm from "../../components/ProblemForm";

export default function SubmitProblem() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0B2545]">
            Register Civic Grievance
          </h1>
          <p className="mt-2 text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Fill the details below to report infrastructure, civic or public issues
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
          <ProblemForm />
        </div>
      </main>
    </div>
  );
}
