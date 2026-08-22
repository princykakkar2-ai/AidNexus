import Navbar from "../components/Navbar";
import ProblemForm from "../components/ProblemForm";

export default function SubmitProblem() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900">Submit a Problem</h1>
          <p className="mt-3 text-slate-600">Report a real-world community challenge.</p>
        </div>
        <ProblemForm />
      </main>
    </>
  );
}
