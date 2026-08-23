import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchExpertSolutions } from "../../services/api";
import "./ExpertDashboard.css";
import Navbar from "../../components/Navbar";
function ExpertDashboard() {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("NEWEST");

  const navigate = useNavigate();

  const loadSolutions = async () => {
    try {
      setLoading(true);
      setError(false);

      const data = await fetchExpertSolutions();

      console.log("EXPERT SOLUTIONS:", data);

      setSolutions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("EXPERT API ERROR:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSolutions();
  }, []);

  // ==============================
  // STATISTICS
  // ==============================

  const statistics = useMemo(() => {
    return {
      total: solutions.length,

      underReview: solutions.filter(
        (solution) =>
          solution.status === "UNDER_REVIEW" || solution.status === "Pending",
      ).length,

      approved: solutions.filter(
        (solution) =>
          solution.status === "APPROVED" || solution.status === "Approved",
      ).length,

      needsImprovement: solutions.filter(
        (solution) =>
          solution.status === "NEEDS_IMPROVEMENT" ||
          solution.status === "Needs Improvement",
      ).length,

      rejected: solutions.filter(
        (solution) =>
          solution.status === "REJECTED" || solution.status === "Rejected",
      ).length,
    };
  }, [solutions]);

  // ==============================
  // SEARCH + FILTER + SORT
  // ==============================

  const filteredSolutions = useMemo(() => {
    let result = [...solutions];

    // Search
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();

      result = result.filter((solution) => {
        return (
          solution.project_title?.toLowerCase().includes(search) ||
          solution.student_name?.toLowerCase().includes(search) ||
          solution.problem_description?.toLowerCase().includes(search) ||
          solution.technologies?.toLowerCase().includes(search)
        );
      });
    }

    // Status filter
    if (statusFilter !== "ALL") {
      result = result.filter((solution) => {
        const status = solution.status;

        if (statusFilter === "UNDER_REVIEW") {
          return status === "UNDER_REVIEW" || status === "Pending";
        }

        if (statusFilter === "APPROVED") {
          return status === "APPROVED" || status === "Approved";
        }

        if (statusFilter === "REJECTED") {
          return status === "REJECTED" || status === "Rejected";
        }

        if (statusFilter === "NEEDS_IMPROVEMENT") {
          return (
            status === "NEEDS_IMPROVEMENT" || status === "Needs Improvement"
          );
        }

        return true;
      });
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);

      return sortOrder === "NEWEST" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [solutions, searchTerm, statusFilter, sortOrder]);

  // ==============================
  // HELPERS
  // ==============================

  const getStatusClass = (status) => {
    if (!status) return "";

    return status.replace(/_/g, "-").replace(/\s+/g, "-").toLowerCase();
  };

  const formatStatus = (status) => {
    if (!status) return "Unknown";

    return status
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <div className="expert-page-state">
        <div className="loader"></div>
        <h3>Loading solutions...</h3>
        <p>Fetching student projects for expert review.</p>
      </div>
    );
  }

  // ==============================
  // ERROR
  // ==============================

  if (error) {
    return (
      <div className="expert-page-state error-state">
        <div className="state-icon">⚠️</div>

        <h2>Unable to load solutions</h2>

        <p>Something went wrong while connecting to the Expert API.</p>

        <button className="refresh-btn" onClick={loadSolutions}>
          ↻ Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="expert-dashboard">
      <Navbar />
      {/* =========================
          HEADER
      ========================= */}

      <div className="expert-header">
        <div>
          <span className="dashboard-label">INDUSTRY & EXPERT MODULE</span>

          <h1>Expert Review Dashboard</h1>

          <p>
            Review student solutions and help transform promising ideas into
            impactful real-world projects.
          </p>
        </div>

        <button className="refresh-btn" onClick={loadSolutions}>
          ↻ Refresh
        </button>
      </div>

      {/* =========================
          STATISTICS
      ========================= */}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>

          <div>
            <span>Total Solutions</span>
            <strong>{statistics.total}</strong>
          </div>
        </div>

        <div className="stat-card review-stat">
          <div className="stat-icon">⏳</div>

          <div>
            <span>Under Review</span>
            <strong>{statistics.underReview}</strong>
          </div>
        </div>

        <div className="stat-card approved-stat">
          <div className="stat-icon">✓</div>

          <div>
            <span>Approved</span>
            <strong>{statistics.approved}</strong>
          </div>
        </div>

        <div className="stat-card improvement-stat">
          <div className="stat-icon">💡</div>

          <div>
            <span>Needs Improvement</span>
            <strong>{statistics.needsImprovement}</strong>
          </div>
        </div>

        <div className="stat-card rejected-stat">
          <div className="stat-icon">✕</div>

          <div>
            <span>Rejected</span>
            <strong>{statistics.rejected}</strong>
          </div>
        </div>
      </div>

      {/* =========================
          SEARCH + FILTER
      ========================= */}

      <div className="filter-section">
        <div className="search-box">
          <span>🔎</span>

          <input
            type="text"
            placeholder="Search by project, student, problem or technology..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm("")}>
              ×
            </button>
          )}
        </div>

        <div className="filter-controls">
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="APPROVED">Approved</option>
            <option value="NEEDS_IMPROVEMENT">Needs Improvement</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <select
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
          >
            <option value="NEWEST">Newest First</option>
            <option value="OLDEST">Oldest First</option>
          </select>
        </div>
      </div>

      {/* =========================
          EMPTY DATABASE
      ========================= */}

      {solutions.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>

          <h2>No solutions to review yet</h2>

          <p>
            New student solutions will appear here once they are submitted for
            expert evaluation.
          </p>

          <button className="refresh-btn" onClick={loadSolutions}>
            ↻ Check for New Solutions
          </button>
        </div>
      )}

      {/* =========================
          NO SEARCH RESULTS
      ========================= */}

      {solutions.length > 0 && filteredSolutions.length === 0 && (
        <div className="empty-state small-empty">
          <div className="empty-icon">🔎</div>

          <h2>No matching solutions</h2>

          <p>Try changing your search term or status filter.</p>

          <button
            className="secondary-btn"
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("ALL");
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* =========================
          SOLUTION CARDS
      ========================= */}

      {filteredSolutions.length > 0 && (
        <div className="results-header">
          <h2>
            Solutions for Review
            <span>{filteredSolutions.length}</span>
          </h2>
        </div>
      )}

      <div className="solution-list">
        {filteredSolutions.map((sol) => (
          <div key={sol.id} className="solution-card">
            <div className="card-top">
              <span className="project-label">STUDENT PROJECT</span>

              <span className={`status-badge ${getStatusClass(sol.status)}`}>
                {formatStatus(sol.status)}
              </span>
            </div>

            <h2>{sol.project_title}</h2>

            <div className="student-info">
              <span className="student-avatar">
                {sol.student_name?.charAt(0)?.toUpperCase() || "S"}
              </span>

              <div>
                <strong>{sol.student_name || "Unknown Student"}</strong>

                {sol.student_email && <small>{sol.student_email}</small>}
              </div>
            </div>

            <div className="card-section">
              <span className="section-label">PROBLEM</span>

              <p>{sol.problem_description}</p>
            </div>

            <div className="card-section">
              <span className="section-label">SOLUTION</span>

              <p>{sol.solution_description}</p>
            </div>

            {sol.technologies && (
              <div className="technology-section">
                {sol.technologies.split(",").map((technology) => (
                  <span key={technology.trim()}>{technology.trim()}</span>
                ))}
              </div>
            )}

            <div className="card-footer">
              {sol.created_at && (
                <span>
                  Submitted {new Date(sol.created_at).toLocaleDateString()}
                </span>
              )}

              <button onClick={() => navigate(`/expert/review/${sol.id}`)}>
                Review Solution →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExpertDashboard;
