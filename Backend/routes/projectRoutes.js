import { Router } from "express";
import {
  getProjects,
  createProject,
  updateProjectProgress,
  offerIndustrySupport,
} from "../controllers/projectController.js";

const router = Router();

router.get("/", getProjects);
router.post("/", createProject);
router.put("/:id/progress", updateProjectProgress);
router.put("/:id/support", offerIndustrySupport);

export default router;
