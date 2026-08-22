import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import './index.css';
import StudentDashboard from "./pages/student/StudentDashboard";
import ExploreProblems from "./pages/student/ExploreProblems";
import ChallengeDetails from "./pages/student/ChallengeDetails";
import SubmitSolution from "./pages/student/SubmitSolution";
import MySolutions from "./pages/student/MySolutions";    

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/problems" element={<ExploreProblems />}/>
        <Route path="/student/problems/:id" element={<ChallengeDetails />}/>
        <Route path="/student/problems/:id/submit" element={<SubmitSolution />} />
        <Route path="/student/solutions" element={<MySolutions />}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;