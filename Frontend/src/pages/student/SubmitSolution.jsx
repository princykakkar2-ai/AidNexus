import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./SubmitSolution.css";

function SubmitSolution() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technology, setTechnology] = useState("");
  const [impact, setImpact] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const solution = {
      problemId: id,
      title,
      description,
      technology,
      impact,
    };

    console.log("Solution submitted:", solution);

    alert("Solution submitted successfully!");

    navigate("/student/solutions");
  };

  return (
    <div className="submit-solution">

      {/* Header */}

      <div className="submit-header">

        <button
          className="back-button"
          onClick={() => navigate(`/student/problems/${id}`)}
        >
          ← Back to Challenge
        </button>

        <p className="section-label">
          SUBMIT SOLUTION
        </p>

        <h1>Share Your Solution</h1>

        <p>
          Present your idea and explain how it can solve the
          selected real-world problem.
        </p>

      </div>


      {/* Form */}

      <form
        className="solution-form"
        onSubmit={handleSubmit}
      >

        {/* Solution Title */}

        <div className="form-group">

          <label>
            Solution Title
          </label>

          <input
            type="text"
            placeholder="Enter a title for your solution"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

        </div>


        {/* Description */}

        <div className="form-group">

          <label>
            Solution Description
          </label>

          <textarea
            placeholder="Explain your solution in detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="7"
            required
          />

        </div>


        {/* Technology */}

        <div className="form-group">

          <label>
            Technologies / Tools
          </label>

          <input
            type="text"
            placeholder="Example: React, Node.js, MongoDB, AI"
            value={technology}
            onChange={(e) => setTechnology(e.target.value)}
            required
          />

        </div>


        {/* Impact */}

        <div className="form-group">

          <label>
            Expected Impact
          </label>

          <textarea
            placeholder="Explain the expected impact of your solution..."
            value={impact}
            onChange={(e) => setImpact(e.target.value)}
            rows="5"
            required
          />

        </div>


        {/* Buttons */}

        <div className="form-actions">

          <button
            type="button"
            className="cancel-button"
            onClick={() =>
              navigate(`/student/problems/${id}`)
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="submit-button"
          >
            Submit Solution →
          </button>

        </div>

      </form>

    </div>
  );
}

export default SubmitSolution;