import { useNavigate } from "react-router-dom";
import "./MySolutions.css";

const solutions = [
  {
    id: 1,
    problemId: 1,
    title: "Smart Waste Collection System",
    problem: "Garbage Management",
    technology: "React, Node.js, MongoDB",
    status: "Under Review",
    submittedOn: "20 Aug 2026",
  },
  {
    id: 2,
    problemId: 2,
    title: "IoT Water Leakage Detection",
    problem: "Water Leakage",
    technology: "IoT, Python, AI",
    status: "Accepted",
    submittedOn: "18 Aug 2026",
  },
];

function MySolutions() {
  const navigate = useNavigate();

  return (
    <div className="my-solutions">

      {/* Header */}

      <div className="solutions-header">

        <button
          className="back-button"
          onClick={() => navigate("/student")}
        >
          ← Back to Dashboard
        </button>

        <p className="section-label">
          STUDENT PORTAL
        </p>

        <h1>My Solutions</h1>

        <p>
          Track the solutions you have submitted and check their
          current status.
        </p>

      </div>


      {/* Solutions */}

      <section className="solutions-section">

        <div className="solutions-heading">
          <div>
            <p className="section-label">YOUR WORK</p>

            <h2>Submitted Solutions</h2>
          </div>

          <button
            className="explore-button"
            onClick={() => navigate("/student/problems")}
          >
            Explore Problems →
          </button>
        </div>


        <div className="solutions-grid">

          {solutions.map((solution) => (

            <div
              className="solution-card"
              key={solution.id}
            >

              <div className="solution-card-top">

                <span
                  className={`solution-status ${solution.status
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {solution.status}
                </span>

                <span className="solution-date">
                  {solution.submittedOn}
                </span>

              </div>


              <h3>{solution.title}</h3>

              <p className="problem-name">
                Challenge: {solution.problem}
              </p>


              <div className="solution-info">

                <div>
                  <span>🛠️</span>

                  <div>
                    <strong>Technologies</strong>
                    <p>{solution.technology}</p>
                  </div>
                </div>

              </div>


              <button
                className="view-solution-button"
                onClick={() =>
                  navigate(`/student/problems/${solution.problemId}`)
                }
              >
                View Challenge →
              </button>

            </div>

          ))}

        </div>

      </section>

    </div>
  );
}

export default MySolutions;