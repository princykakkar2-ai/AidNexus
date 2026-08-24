import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProblems } from "../../services/api";
import { CANONICAL_PROBLEMS } from "../../data/canonicalProblems";
import "./ExploreProblems.css";

function ExploreProblems() {
  const navigate = useNavigate();

  const [problems, setProblems] = useState(CANONICAL_PROBLEMS);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [priority, setPriority] = useState("All");

  useEffect(() => {
    fetchProblems()
      .then((data) => {
        if (data && data.length > 0) {
          const combined = [...data];
          CANONICAL_PROBLEMS.forEach((cp) => {
            if (!combined.some((p) => (p._id || p.id) === (cp._id || cp.id))) {
              combined.push(cp);
            }
          });
          setProblems(combined);
        } else {
          setProblems(CANONICAL_PROBLEMS);
        }
      })
      .catch((err) => {
        console.warn("Using canonical problems:", err);
        setProblems(CANONICAL_PROBLEMS);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredProblems = problems.filter((problem) => {
    const title = (problem.title || "").toLowerCase();
    const desc = (problem.description || problem.desc || "").toLowerCase();
    const loc = (problem.location || "").toLowerCase();
    const q = search.toLowerCase();

    const matchesSearch = q === "" || title.includes(q) || desc.includes(q) || loc.includes(q);

    const matchesCategory =
      category === "All" || (problem.category || "").toLowerCase() === category.toLowerCase();

    const probPri = (problem.priority || "MEDIUM").toUpperCase();
    const filterPri = priority.toUpperCase();
    const matchesPriority =
      filterPri === "ALL" ||
      (filterPri === "HIGH" && (probPri === "HIGH" || probPri === "CRITICAL")) ||
      (filterPri === "MEDIUM" && probPri === "MEDIUM") ||
      (filterPri === "LOW" && probPri === "LOW");

    return matchesSearch && matchesCategory && matchesPriority;
  });

  return (
    <div className="explore-problems">
      <button onClick={() => navigate(-1)} className="back-button">← Back</button>

      {/* Header */}
      <section className="explore-header">
        <p className="section-label">DISCOVER</p>
        <h1>Explore Problems</h1>
        <p>
          Discover real-world verified grievances and use your technical skills to build meaningful prototypes.
        </p>
      </section>

      {/* Search and Filters */}
      <section className="filters">
        <div className="search-box">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search problems by keyword or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Infrastructure">Infrastructure</option>
          <option value="Electricity">Electricity</option>
          <option value="Environment">Environment</option>
          <option value="Waste Management">Waste Management</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Transportation">Transportation</option>
        </select>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="All">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </section>

      {/* Number of results */}
      <div className="results-count">
        <p>
          Showing <strong>{filteredProblems.length}</strong> {filteredProblems.length === 1 ? "problem" : "problems"}
        </p>
      </div>

      {/* Problem Cards */}
      <section className="problems-grid">
        {loading ? (
          <div className="no-results">
            <p>Loading grievances...</p>
          </div>
        ) : filteredProblems.length > 0 ? (
          filteredProblems.map((problem) => {
            const probId = problem._id || problem.id;
            const priLower = (problem.priority || "medium").toLowerCase();
            return (
              <div className="problem-card" key={probId}>
                <div className="problem-card-top">
                  <span className={`priority-badge ${priLower}`}>
                    {problem.priority || "MEDIUM"} Priority
                  </span>

                  <span className="category-badge">
                    {problem.category}
                  </span>
                </div>

                <h2>{problem.title}</h2>

                <p className="problem-description">
                  {problem.description || problem.desc}
                </p>

                <div className="problem-location">
                  📍 {problem.location}
                </div>

                <button
                  onClick={() => navigate(`/student/problems/${probId}`)}
                >
                  View Challenge →
                </button>
              </div>
            );
          })
        ) : (
          <div className="no-results">
            <h2>No problems found</h2>
            <p>Try adjusting your search query or filter criteria.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default ExploreProblems;