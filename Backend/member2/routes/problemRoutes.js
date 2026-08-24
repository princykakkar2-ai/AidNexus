import { Router } from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import {
  createProblem,
  getProblems,
  getProblemById,
  deleteProblem,
} from "../controllers/problemController.js";

const router = Router();
const uploadDir = path.resolve("uploads/problems");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post("/", upload.single("image"), createProblem);
router.get("/", getProblems);
router.get("/:id", getProblemById);
router.delete("/:id", deleteProblem);

export default router;
