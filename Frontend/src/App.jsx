import { BrowserRouter, Routes, Route } from "react-router-dom";

import ExpertDashboard from "./pages/expert/ExpertDashboard";
import ReviewSolution from "./pages/expert/ReviewSolution";
import Home from "./pages/Home";

import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Expert / Industry Module */}
        <Route path="/expert" element={<ExpertDashboard />} />
        <Route path="/expert/review/:id" element={<ReviewSolution />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
