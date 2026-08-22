import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ExploreProblems.css";

const problems = [
  {
    id: 1,
    title: "Garbage Management",
    description:
      "Develop an efficient solution for improving garbage collection in residential areas.",
    category: "Waste Management",
    priority: "High",
    location: "Noida",
  },
  {
    id: 2,
    title: "Water Leakage",
    description:
      "Develop a solution to identify and reduce water leakage in public pipelines.",
    category: "Water",
    priority: "Medium",
    location: "Ghaziabad",
  },
  {
    id: 3,
    title: "Street Light Monitoring",
    description:
      "Create a smart system to detect faulty street lights and report them automatically.",
    category: "Infrastructure",
    priority: "High",
    location: "Delhi",
  },
  {
    id: 4,
    title: "Traffic Congestion",
    description:
      "Find an intelligent approach to reduce traffic congestion near busy intersections.",
    category: "Transportation",
    priority: "Medium",
    location: "Noida",
  },
  {
    id: 5,
    title: "Public Park Maintenance",
    description:
      "Suggest a technology-based solution for monitoring cleanliness and maintenance of parks.",
    category: "Environment",
    priority: "Low",
    location: "Ghaziabad",
  },
  {
    id: 6,
    title: "Air Quality Monitoring",
    description:
      "Build a system that can help citizens monitor air quality in different areas.",
    category: "Environment",
    priority: "High",
    location: "Delhi",
  },
];

function ExploreProblems() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [priority, setPriority] = useState("All");

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(search.toLowerCase()) ||
      problem.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || problem.category === category;

    const matchesPriority =
      priority === "All" || problem.priority === priority;

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
          Discover real-world problems and use your skills to create
          meaningful solutions.
        </p>
      </section>

      {/* Search and Filters */}
      <section className="filters">

        <div className="search-box">
          <span>🔍</span>

          <input
            type="text"
            placeholder="Search problems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Waste Management">Waste Management</option>
          <option value="Water">Water</option>
          <option value="Infrastructure">Infrastructure</option>
          <option value="Transportation">Transportation</option>
          <option value="Environment">Environment</option>
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
          Showing <strong>{filteredProblems.length}</strong> problems
        </p>
      </div>

      {/* Problem Cards */}
      <section className="problems-grid">

        {filteredProblems.length > 0 ? (
          filteredProblems.map((problem) => (
            <div className="problem-card" key={problem.id}>

              <div className="problem-card-top">
                <span
                  className={`priority-badge ${problem.priority.toLowerCase()}`}
                >
                  {problem.priority} Priority
                </span>

                <span className="category-badge">
                  {problem.category}
                </span>
              </div>

              <h2>{problem.title}</h2>

              <p className="problem-description">
                {problem.description}
              </p>

              <div className="problem-location">
                📍 {problem.location}
              </div>

              <button
                onClick={() =>
                  navigate(`/student/problems/${problem.id}`)
                }
              >
                View Challenge →
              </button>

            </div>
          ))
        ) : (
          <div className="no-results">
            <h2>No problems found</h2>
            <p>
              Try changing your search or filter.
            </p>
          </div>
        )}

      </section>

    </div>
  );
}

export default ExploreProblems;