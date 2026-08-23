import Solution from "../models/Solution.js";
import Feedback from "../models/Feedback.js";

// GET /api/feedback/expert/solutions
export async function getExpertSolutions(req, res) {
  try {
    const solutions = await Solution.find();
    const result = solutions.map((sol) => ({
      id: sol._id || sol.id,
      project_title: sol.project_title,
      student_name: sol.student_name,
      problem_description: sol.problem_description
        ? sol.problem_description.slice(0, 150) + "..."
        : "",
      status: sol.status,
      technologies: sol.technologies,
    }));
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// GET /api/feedback/solution/:solutionId
export async function getSolutionDetails(req, res) {
  try {
    const sol = await Solution.findById(req.params.solutionId);
    if (!sol) {
      return res.status(404).json({ message: "Solution not found" });
    }
    const data = {
      id: sol._id || sol.id,
      project_title: sol.project_title,
      problem_statement: sol.problem_description,
      student_name: sol.student_name,
      student_email: sol.student_email,
      solution_description: sol.solution_description,
      technologies: sol.technologies,
      github_link: sol.github_link,
      demo_link: sol.demo_link,
      status: sol.status,
    };
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// GET /api/feedback/solution/:solutionId/feedback
export async function getFeedbackForSolution(req, res) {
  try {
    const feedbacks = await Feedback.find({ solution_id: req.params.solutionId });
    const data = feedbacks.map((fb) => ({
      id: fb._id || fb.id,
      expert_id: fb.expert_id,
      rating: fb.rating,
      feedback_text: fb.feedback_text,
      suggestions: fb.suggestions,
      status: fb.status,
      created_at: fb.createdAt || new Date(),
    }));
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// POST /api/feedback/solution/:solutionId
export async function submitExpertFeedback(req, res) {
  try {
    const { rating, feedback: feedbackText, suggestions, status } = req.body;
    const { solutionId } = req.params;

    if (rating === undefined || !feedbackText || !status) {
      return res.status(400).json({ message: "Rating, feedback, and status are required" });
    }

    const sol = await Solution.findById(solutionId);
    if (!sol) {
      return res.status(404).json({ message: "Solution not found" });
    }

    // Create new feedback
    const newFeedback = await Feedback.create({
      solution_id: solutionId,
      expert_id: "expert-demo",
      rating: Number(rating),
      feedback_text: feedbackText,
      suggestions: suggestions || "",
      status,
    });

    // Update solution status
    await Solution.findByIdAndUpdate(solutionId, { status });

    return res.status(201).json({ message: "Feedback submitted successfully", data: newFeedback });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
