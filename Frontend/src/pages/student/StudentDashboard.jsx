import { Link } from "react-router-dom";
import "./StudentDashboard.css";

function StudentDashboard() {
  return (
    <div className="student-dashboard">

      {/* Welcome Section */}
      <section className="student-welcome">
        <div>
          <p className="welcome-label">STUDENT PORTAL</p>

          <h1>Welcome back, Student! 👋</h1>

          <p className="welcome-text">
            Discover real-world problems and create innovative solutions
            that can make an impact in your community.
          </p>
        </div>
      </section>

      {/* Statistics */}
      <section className="student-stats">

        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div>
            <h2>24</h2>
            <p>Available Problems</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💡</div>
          <div>
            <h2>8</h2>
            <p>Solutions Submitted</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div>
            <h2>3</h2>
            <p>Solutions Accepted</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div>
            <h2>4.8</h2>
            <p>Average Rating</p>
          </div>
        </div>

      </section>

      {/* Explore Section */}
      <section className="explore-section">

        <div className="section-heading">
          <div>
            <p className="section-label">DISCOVER</p>
            <h2>Explore Problems</h2>
            <p>
              Find problems that match your skills and interests.
            </p>
          </div>

          <Link to="/student/problems" className="explore-button"> View All Problems → </Link>
        </div>

        {/* Problem Cards */}
        <div className="problem-preview">

          <div className="problem-preview-card">
            <span className="priority high">HIGH PRIORITY</span>

            <h3>Garbage Management</h3>

            <p>
              Find an efficient solution for improving garbage collection
              in residential areas.
            </p>

            <div className="problem-info">
              <span>📍 Noida</span>
              <span>♻️ Waste Management</span>
            </div>

            <Link to="/student/problems/2" className="challenge-button">View Challenge →</Link>
          </div>

          <div className="problem-preview-card">
            <span className="priority medium">MEDIUM PRIORITY</span>

            <h3>Water Leakage</h3>

            <p>
              Develop a solution to identify and reduce water leakage
              in public pipelines.
            </p>

            <div className="problem-info">
              <span>📍 Ghaziabad</span>
              <span>💧 Water</span>
            </div>

            <Link to="/student/problems/1" className="challenge-button">View Challenge →</Link>
          </div>

        </div>

      </section>

    </div>
  );
}

export default StudentDashboard;