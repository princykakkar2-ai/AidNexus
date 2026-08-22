import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";

// Student pages
import StudentDashboard from "./pages/student/StudentDashboard";
import ExploreProblems from "./pages/student/ExploreProblems";
import ChallengeDetails from "./pages/student/ChallengeDetails";
import SubmitSolution from "./pages/student/SubmitSolution";
import MySolutions from "./pages/student/MySolutions";

// Expert pages
import ExpertDashboard from "./pages/expert/ExpertDashboard";
import ReviewSolution from "./pages/expert/ReviewSolution";
import Home from "./pages/Home";
import SubmitProblem from "./pages/SubmitProblem";
import ProblemDetails from "./pages/ProblemDetails";
import Home from "./pages/Home";

import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Student Module */}
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/problems" element={<ExploreProblems />} />
        <Route path="/student/problems/:id" element={<ChallengeDetails />} />
        <Route
          path="/student/problems/:id/submit"
          element={<SubmitSolution />}
        />
        <Route path="/student/solutions" element={<MySolutions />} />

        {/* Problem Module */}
        <Route path="/submit-problem" element={<SubmitProblem />} />
        <Route path="/problems/:id" element={<ProblemDetails />} />

        {/* Expert / Industry Module */}
        <Route path="/expert" element={<ExpertDashboard />} />
        <Route path="/expert/review/:id" element={<ReviewSolution />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;