import React from "react";
import { useNavigate } from "react-router-dom";
import "./SolutionCard.css";

function SolutionCard({ solution }) {
  const navigate = useNavigate();

  const handleViewSolution = () => {
    navigate(`/expert/solution/${solution._id || solution.id}`);
  };

  return (
    <div className="solution-card">
      <div className="solution-card-top">
        <div>
          <h3>{solution.problemTitle}</h3>
          <p className="student-name">Submitted by {solution.studentName}</p>
        </div>

        <span
          className={`solution-status ${solution.status
            ?.toLowerCase()
            .replace(/\s+/g, "-")}`}
        >
          {solution.status}
        </span>
      </div>

      <div className="solution-card-details">
        <div className="detail-item">
          <span>Category</span>
          <strong>{solution.category || "General"}</strong>
        </div>

        <div className="detail-item">
          <span>Submitted</span>
          <strong>{solution.submittedAt || "Recently"}</strong>
        </div>

        <div className="detail-item">
          <span>Technology</span>
          <strong>{solution.technology || "Not specified"}</strong>
        </div>
      </div>

      <button className="view-solution-btn" onClick={handleViewSolution}>
        View Solution →
      </button>
    </div>
  );
}

export default SolutionCard;
