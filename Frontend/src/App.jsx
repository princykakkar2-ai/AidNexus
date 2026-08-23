import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import SubmitProblem from "./pages/citizen/SubmitProblem";
import ProblemDetails from "./pages/ProblemDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";

import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

import StudentDashboard from "./pages/student/StudentDashboard";
import ExploreProblems from "./pages/student/ExploreProblems";
import ChallengeDetails from "./pages/student/ChallengeDetails";
import SubmitSolution from "./pages/student/SubmitSolution";
import MySolutions from "./pages/student/MySolutions";

import ExpertDashboard from "./pages/expert/ExpertDashboard";
import ReviewSolution from "./pages/expert/ReviewSolution";

import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Problem Module */}
        <Route path="/submit-problem" element={<SubmitProblem />} />
        <Route path="/problems/:id" element={<ProblemDetails />} />

        {/* Citizen */}
        <Route path="/citizen" element={<CitizenDashboard />} />

        {/* Student */}
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/problems" element={<ExploreProblems />} />
        <Route
          path="/student/problems/:id"
          element={<ChallengeDetails />}
        />
        <Route
          path="/student/problems/:id/submit"
          element={<SubmitSolution />}
        />
        <Route path="/student/solutions" element={<MySolutions />} />

        {/* Expert / Industry */}
        <Route path="/expert" element={<ExpertDashboard />} />
        <Route path="/expert/review/:id" element={<ReviewSolution />} />
        <Route path="/industry" element={<ExpertDashboard />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Legacy routes */}
        <Route path="/problems" element={<CitizenDashboard />} />
        <Route path="/solutions" element={<StudentDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;