import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProblem, fetchProblems } from "../../services/api";
import { CANONICAL_PROBLEMS } from "../../data/canonicalProblems";
import "./ChallengeDetails.css";

function ChallengeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to find in canonical first for instant UI
    const canonicalMatch = CANONICAL_PROBLEMS.find(
      (item) => (item._id || item.id) === id || String(item.id) === String(id)
    );
    if (canonicalMatch) {
      setProblem(canonicalMatch);
    }

    // Also fetch fresh from API
    fetchProblem(id)
      .then((data) => {
        if (data) {
          setProblem(data);
        }
      })
      .catch(() => {
        // If single fetch fails, try fetch all
        fetchProblems()
          .then((allData) => {
            const match = allData.find(
              (p) => (p._id || p.id) === id || String(p.id) === String(id)
            );
            if (match) setProblem(match);
          })
          .catch((e) => console.warn("Failed fetching challenge details:", e));
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading && !problem) {
    return (
      <div className="challenge-details">
        <div className="challenge-not-found">
          <h2>Loading Challenge Details...</h2>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="challenge-details">
        <div className="challenge-not-found">
          <h2>Problem Not Found</h2>
          <p>The problem you are looking for does not exist or has been resolved.</p>
          <button onClick={() => navigate("/student/problems")}>
            ← Back to Problems
          </button>
        </div>
      </div>
    );
  }

  const probId = problem._id || problem.id;
  const priLower = (problem.priority || "medium").toLowerCase();

  return (
    <div className="challenge-details">
      {/* Back button */}
      <button
        className="back-button"
        onClick={() => navigate("/student/problems")}
      >
        ← Back to Problems
      </button>

      {/* Main content */}
      <div className="challenge-container">
        <div className="challenge-main">
          <div className="challenge-badges">
            <span className={`priority-badge ${priLower}`}>
              {problem.priority || "MEDIUM"} Priority
            </span>

            <span className="category-badge">
              {problem.category}
            </span>
          </div>

          <h1>{problem.title}</h1>

          <p className="challenge-description">
            {problem.description || problem.desc}
          </p>

          <div className="challenge-section">
            <h2>Problem Statement</h2>
            <p>
              This grievance has been reported by local citizens and verified through administrative channels. 
              Your team's objective is to research the root cause, validate field constraints, and engineer a 
              working prototype or technological intervention.
            </p>
          </div>

          <div className="challenge-section">
            <h2>Expected Solution & Deliverables</h2>
            <p>
              Students are encouraged to propose a solution that is technically feasible, scalable, 
              cost-effective, and capable of creating measurable civic impact. Prototypes can be submitted for 
              industry grant funding and mentorship support.
            </p>
          </div>
        </div>

        {/* Right side */}
        <aside className="challenge-sidebar">
          <div className="info-card">
            <h3>Challenge Information</h3>

            <div className="info-item">
              <span>📍 Location</span>
              <strong>{problem.location}</strong>
            </div>

            <div className="info-item">
              <span>🏷️ Category</span>
              <strong>{problem.category}</strong>
            </div>

            <div className="info-item">
              <span>⚡ Priority</span>
              <strong>{problem.priority || "MEDIUM"}</strong>
            </div>

            <div className="info-item">
              <span>📌 Status</span>
              <strong>{(problem.status || "SUBMITTED").replace("_", " ")}</strong>
            </div>

            <div className="info-item">
              <span>👤 Reported By</span>
              <strong>{problem.submittedBy || problem.createdBy || "Verified Citizen"}</strong>
            </div>

            {problem.votes !== undefined && (
              <div className="info-item">
                <span>▲ Endorsements</span>
                <strong>{problem.votes} Citizen Votes</strong>
              </div>
            )}
          </div>

          <button
            className="solution-button"
            onClick={() =>
              navigate(`/student/problems/${probId}/submit`)
            }
          >
            Submit Your Solution →
          </button>
        </aside>
      </div>
    </div>
  );
}

export default ChallengeDetails;