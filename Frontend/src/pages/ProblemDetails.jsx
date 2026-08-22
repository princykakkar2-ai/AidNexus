import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProblemCard from "../components/ProblemCard";
import { fetchProblem } from "../services/api";

export default function ProblemDetails() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProblem(id).then(setProblem).catch((err) => setError(err.response?.data?.message || "Unable to load problem."));
  }, [id]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-12">
        {error && (
          <p className="rounded-[4px] bg-red-50 p-4 text-xs font-bold text-red-700 border border-red-200 mb-6">
            {error}
          </p>
        )}
        {problem && <ProblemCard problem={problem} />}
        <Link to="/citizen" className="mt-6 inline-block text-xs font-bold text-[#D97706] hover:underline uppercase tracking-wider">
          ← BACK TO REPORT ARCHIVE
        </Link>
      </main>
    </div>
  );
}
