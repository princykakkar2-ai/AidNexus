import React, { useState } from "react";
import "./FeedbackForm.css";

const statuses = ["Approved", "Needs Improvement", "Rejected"];

function FeedbackForm({ onSubmit }) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [status, setStatus] = useState(statuses[1]); // default "Needs Improvement"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    if (rating < 1 || rating > 5)
      return "Please provide a rating between 1 and 5.";
    if (!feedback.trim()) return "Feedback cannot be empty.";
    if (!status) return "Please select a status.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setLoading(true);
    try {
      await onSubmit({ rating, feedback, suggestions, status });
    } catch {
      setError("Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= rating ? "filled" : ""}`}
          onClick={() => setRating(i)}
          role="button"
          aria-label={`Set rating to ${i}`}
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setRating(i)}
        >
          ★
        </span>,
      );
    }
    return stars;
  };

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      <label>Rating:</label>
      <div className="star-rating">{renderStars()}</div>

      <label htmlFor="feedback">Feedback:</label>
      <textarea
        id="feedback"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        rows={4}
        required
      ></textarea>

      <label htmlFor="suggestions">Suggestions:</label>
      <textarea
        id="suggestions"
        value={suggestions}
        onChange={(e) => setSuggestions(e.target.value)}
        rows={3}
        placeholder="Optional"
      ></textarea>

      <label>Status:</label>
      <div className="status-options">
        {statuses.map((s) => (
          <label key={s}>
            <input
              type="radio"
              name="status"
              value={s}
              checked={status === s}
              onChange={() => setStatus(s)}
            />
            {s}
          </label>
        ))}
      </div>

      {error && <p className="error-message">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit Feedback"}
      </button>
    </form>
  );
}

export default FeedbackForm;
