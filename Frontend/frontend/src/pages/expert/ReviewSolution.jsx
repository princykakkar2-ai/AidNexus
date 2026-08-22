import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  fetchSolutionDetails,
  fetchFeedback,
  submitFeedback,
} from "../../services/api";
import FeedbackForm from "../../components/expert/FeedbackForm";
import "./ReviewSolution.css";

function ReviewSolution() {
  const { id } = useParams();
  const [solution, setSolution] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const solData = await fetchSolutionDetails(id);
        const fbData = await fetchFeedback(id);
        setSolution(solData);
        setFeedbacks(fbData);
        setLoading(false);
      } catch {
        setError(true);
        setLoading(false);
      }
    }
    loadData();
  }, [id, formSubmitted]);

  const handleFeedbackSubmit = async (formData) => {
    try {
      await submitFeedback(id, formData);
      setFormSubmitted(!formSubmitted); // trigger re-fetch feedback
      alert("Feedback submitted successfully!");
    } catch {
      alert("Failed to submit feedback.");
    }
  };

  if (loading) return <p className="loading">Loading solution...</p>;
  if (error)
    return <p className="error">Failed to load solution. Try again later.</p>;
  if (!solution) return <p className="empty">Solution not found.</p>;

  return (
    <div className="review-solution">
      <h1>Review Solution: {solution.project_title}</h1>
      <section className="solution-details">
        <p>
          <strong>Problem Statement:</strong> {solution.problem_statement}
        </p>
        <p>
          <strong>Student/Team:</strong> {solution.student_name} (
          {solution.student_email})
        </p>
        <p>
          <strong>Solution Description:</strong> {solution.solution_description}
        </p>
        <p>
          <strong>Technologies:</strong> {solution.technologies || "N/A"}
        </p>
        <p>
          <strong>GitHub:</strong>{" "}
          {solution.github_link ? (
            <a href={solution.github_link} target="_blank" rel="noreferrer">
              {solution.github_link}
            </a>
          ) : (
            "N/A"
          )}
        </p>
        <p>
          <strong>Demo:</strong>{" "}
          {solution.demo_link ? (
            <a href={solution.demo_link} target="_blank" rel="noreferrer">
              {solution.demo_link}
            </a>
          ) : (
            "N/A"
          )}
        </p>
        <p>
          <strong>Current Status:</strong>{" "}
          <span
            className={`status-badge status-${solution.status.replace(" ", "").toLowerCase()}`}
          >
            {solution.status}
          </span>
        </p>
      </section>

      <section className="existing-feedback">
        <h2>Existing Feedback</h2>
        {feedbacks.length === 0 ? (
          <p>No feedback submitted yet.</p>
        ) : (
          feedbacks.map((fb) => (
            <div key={fb.id} className="feedback-card">
              <p>
                <strong>Rating:</strong> {fb.rating}/5
              </p>
              <p>
                <strong>Feedback:</strong> {fb.feedback_text}
              </p>
              {fb.suggestions && (
                <p>
                  <strong>Suggestions:</strong> {fb.suggestions}
                </p>
              )}
              <p>
                <strong>Status:</strong> {fb.status}
              </p>
              <p>
                <em>
                  Submitted on: {new Date(fb.created_at).toLocaleString()}
                </em>
              </p>
            </div>
          ))
        )}
      </section>

      <section className="feedback-form-section">
        <h2>Give Feedback</h2>
        <FeedbackForm onSubmit={handleFeedbackSubmit} />
      </section>
    </div>
  );
}

export default ReviewSolution;
