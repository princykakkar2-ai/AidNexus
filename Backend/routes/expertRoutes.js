const express = require("express");

const router = express.Router();

const {
  getExpertSolutions,
  getSolutionDetails,
  getSolutionReviews,
  submitReview,
} = require("../controllers/expertController");

// Get all solutions for expert dashboard
router.get("/solutions", getExpertSolutions);

// Get one solution
router.get("/solutions/:id", getSolutionDetails);

// Get reviews for a solution
router.get("/solutions/:id/reviews", getSolutionReviews);

// Submit expert review
router.post("/solutions/:id/reviews", submitReview);

module.exports = router;
