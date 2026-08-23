import { Router } from "express";

import {
  getExpertSolutions,
  getSolutionDetails,
  getSolutionReviews,
  submitReview,
} from "../controllers/expertController.js";

const router = Router();

router.get("/solutions", getExpertSolutions);

router.get("/solutions/:id", getSolutionDetails);

router.get("/solutions/:id/reviews", getSolutionReviews);

router.post("/solutions/:id/reviews", submitReview);

export default router;
