import { Router } from "express";
import {
  getExpertSolutions,
  getSolutionDetails,
  getFeedbackForSolution,
  submitExpertFeedback,
} from "../controllers/feedbackController.js";

const router = Router();

router.get("/expert/solutions", getExpertSolutions);
router.get("/solution/:solutionId", getSolutionDetails);
router.get("/solution/:solutionId/feedback", getFeedbackForSolution);
router.post("/solution/:solutionId", submitExpertFeedback);

export default router;