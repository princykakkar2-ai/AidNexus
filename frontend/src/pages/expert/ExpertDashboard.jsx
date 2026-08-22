import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchExpertSolutions } from "../../services/api";
import "./ExpertDashboard.css";

function ExpertDashboard() {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExpertSolutions()
      .then((data) => {
        setSolutions(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="loading">Loading solutions...</p>;
  if (error)
    return (
      <p className="error">Failed to load solutions. Please try again later.</p>
    );
  if (solutions.length === 0)
    return <p className="empty">No solutions available for review.</p>;

  return (
    <div className="expert-dashboard">
      <h1>Expert Dashboard - Solutions for Review</h1>
      <div className="solution-list">
        {solutions.map((sol) => (
          <div key={sol.id} className="solution-card">
            <h2>{sol.project_title}</h2>
            <p>
              <strong>Student/Team:</strong> {sol.student_name}
            </p>
            <p>
              <strong>Problem:</strong> {sol.problem_description}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`status-badge status-${sol.status.replace(" ", "").toLowerCase()}`}
              >
                {sol.status}
              </span>
            </p>
            {sol.technologies && (
              <p>
                <strong>Technologies:</strong> {sol.technologies}
              </p>
            )}
            <button onClick={() => navigate(`/expert/review/${sol.id}`)}>
              Review Solution
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExpertDashboard;
