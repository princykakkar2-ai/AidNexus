import { BrowserRouter, Routes, Route } from "react-router-dom";

import ExpertDashboard from "./pages/expert/ExpertDashboard";
import ReviewSolution from "./pages/expert/ReviewSolution";
import Home from "./pages/Home";
import SubmitProblem from "./pages/SubmitProblem";
import ProblemDetails from "./pages/ProblemDetails";
import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />
        <Route path="/submit-problem" element={<SubmitProblem />} />
        <Route path="/problems/:id" element={<ProblemDetails />} />

        {/* Role-based Dashboards */}
        <Route path="/citizen" element={<CitizenDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/industry" element={<ExpertDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Legacy Redirections / Fallbacks */}
        <Route path="/problems" element={<CitizenDashboard />} />
        <Route path="/solutions" element={<StudentDashboard />} />

        {/* Legacy Expert / Industry Module */}
        <Route path="/expert" element={<ExpertDashboard />} />

        <Route path="/expert/review/:id" element={<ReviewSolution />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;
