import Solution from "../models/Solution.js";
import Review from "../models/review.js";

const getExpertSolutions = async (req, res) => {
  try {
    const solutions = await Solution.find().sort({ createdAt: -1 });

    const result = solutions.map((solution) => ({
      id: solution._id,
      project_title: solution.project_title,
      student_name: solution.student_name,
      student_email: solution.student_email,
      problem_description: solution.problem_description,
      solution_description: solution.solution_description,
      technologies: solution.technologies,
      github_link: solution.github_link,
      demo_link: solution.demo_link,
      status: solution.status,
      created_at: solution.createdAt,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching solutions:", error);

    res.status(500).json({
      message: "Failed to fetch solutions",
      error: error.message,
    });
  }
};

const getSolutionDetails = async (req, res) => {
  try {
    const solution = await Solution.findById(req.params.id);

    if (!solution) {
      return res.status(404).json({
        message: "Solution not found",
      });
    }

    res.status(200).json({
      id: solution._id,
      project_title: solution.project_title,
      problem_description: solution.problem_description,
      student_name: solution.student_name,
      student_email: solution.student_email,
      solution_description: solution.solution_description,
      technologies: solution.technologies,
      github_link: solution.github_link,
      demo_link: solution.demo_link,
      status: solution.status,
      created_at: solution.createdAt,
    });
  } catch (error) {
    console.error("Error fetching solution:", error);

    res.status(500).json({
      message: "Failed to fetch solution",
      error: error.message,
    });
  }
};

const getSolutionReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      solutionId: req.params.id,
    }).sort({ createdAt: -1 });

    const result = reviews.map((review) => ({
      id: review._id,
      rating: review.rating,
      feedback_text: review.feedback,
      suggestions: review.suggestions,
      status: review.status,
      created_at: review.createdAt,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching reviews:", error);

    res.status(500).json({
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};

const submitReview = async (req, res) => {
  try {
    const { rating, feedback, suggestions, status } = req.body;

    if (!rating || !feedback || !status) {
      return res.status(400).json({
        message: "Rating, feedback and status are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    const solution = await Solution.findById(req.params.id);

    if (!solution) {
      return res.status(404).json({
        message: "Solution not found",
      });
    }

    const review = new Review({
      solutionId: solution._id,
      rating,
      feedback,
      suggestions,
      status,
    });

    await review.save();

    solution.status = status;
    await solution.save();

    res.status(201).json({
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    console.error("Error submitting review:", error);

    res.status(500).json({
      message: "Failed to submit review",
      error: error.message,
    });
  }
};

export {
  getExpertSolutions,
  getSolutionDetails,
  getSolutionReviews,
  submitReview,
};
