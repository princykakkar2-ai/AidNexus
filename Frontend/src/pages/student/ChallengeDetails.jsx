import { useNavigate, useParams } from "react-router-dom";
import "./ChallengeDetails.css";

const problems = [
  {
    id: 1,
    title: "Garbage Management",
    description:
      "Develop an efficient solution for improving garbage collection in residential areas.",
    category: "Waste Management",
    priority: "High",
    location: "Noida",
    submittedBy: "Citizen",
    status: "Open for Solutions",
  },
  {
    id: 2,
    title: "Water Leakage",
    description:
      "Develop a solution to identify and reduce water leakage in public pipelines.",
    category: "Water",
    priority: "Medium",
    location: "Ghaziabad",
    submittedBy: "Citizen",
    status: "Open for Solutions",
  },
  {
    id: 3,
    title: "Street Light Monitoring",
    description:
      "Create a smart system to detect faulty street lights and report them automatically.",
    category: "Infrastructure",
    priority: "High",
    location: "Delhi",
    submittedBy: "Citizen",
    status: "Open for Solutions",
  },
];

function ChallengeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const problem = problems.find(
    (item) => item.id === Number(id)
  );

  if (!problem) {
    return (
      <div className="challenge-not-found">
        <h2>Problem Not Found</h2>

        <p>
          The problem you are looking for does not exist.
        </p>

        <button onClick={() => navigate("/student/problems")}>
          ← Back to Problems
        </button>
      </div>
    );
  }

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

            <span
              className={`priority-badge ${problem.priority.toLowerCase()}`}
            >
              {problem.priority} Priority
            </span>

            <span className="category-badge">
              {problem.category}
            </span>

          </div>

          <h1>{problem.title}</h1>

          <p className="challenge-description">
            {problem.description}
          </p>

          <div className="challenge-section">

            <h2>Problem Statement</h2>

            <p>
              This problem has been reported by a citizen and requires
              innovative ideas from students. Your goal is to understand
              the problem, identify its root cause and propose a practical
              solution.
            </p>

          </div>

          <div className="challenge-section">

            <h2>Expected Solution</h2>

            <p>
              Students are encouraged to propose a solution that is
              technically feasible, scalable and capable of creating
              measurable impact in the community.
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
              <strong>{problem.priority}</strong>
            </div>

            <div className="info-item">
              <span>📌 Status</span>
              <strong>{problem.status}</strong>
            </div>

            <div className="info-item">
              <span>👤 Submitted By</span>
              <strong>{problem.submittedBy}</strong>
            </div>

          </div>

          <button
            className="solution-button"
            onClick={() =>
              navigate(`/student/problems/${problem.id}/submit`)
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