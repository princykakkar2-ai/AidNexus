const Solution = require("../models/Solution");
const Review = require("../models/Review");

// ==========================================
// GET ALL SOLUTIONS
// ==========================================

const getExpertSolutions = async (req, res) => {
  try {
    const solutions = await Solution.find()
      .populate("submittedBy", "name email")
      .sort({ createdAt: -1 });

    const result = solutions.map((solution) => ({
      id: solution._id,
      project_title: solution.title,

      student_name: solution.submittedBy
        ? solution.submittedBy.name
        : "Unknown",

      student_email: solution.submittedBy ? solution.submittedBy.email : "",

      problem_id: solution.problemId,

      problem_description: solution.description,

      solution_description: solution.description,

      technologies: solution.technology,

      impact: solution.impact,

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

// ==========================================
// GET SINGLE SOLUTION
// ==========================================

const getSolutionDetails = async (req, res) => {
  try {
    const solution = await Solution.findById(req.params.id).populate(
      "submittedBy",
      "name email",
    );

    if (!solution) {
      return res.status(404).json({
        message: "Solution not found",
      });
    }

    res.status(200).json({
      id: solution._id,

      project_title: solution.title,

      problem_id: solution.problemId,

      problem_statement: solution.description,

      student_name: solution.submittedBy
        ? solution.submittedBy.name
        : "Unknown",

      student_email: solution.submittedBy ? solution.submittedBy.email : "",

      solution_description: solution.description,

      technologies: solution.technology,

      impact: solution.impact,

      github_link: null,

      demo_link: null,

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

// ==========================================
// GET REVIEWS
// ==========================================

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

// ==========================================
// SUBMIT REVIEW
// ==========================================

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

    // Update solution status

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

module.exports = {
  getExpertSolutions,
  getSolutionDetails,
  getSolutionReviews,
  submitReview,
};
