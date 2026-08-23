import { Router } from "express";
import Team from "../models/TeamModel.js";

const router = Router();

// Add a team
router.post("/", async (req, res) => {
  try {
    const { name, university, skills, categories, location, available } = req.body;

    if (!name || !university || !skills || !categories) {
      return res.status(400).json({
        success: false,
        message: "name, university, skills and categories are required",
      });
    }

    const team = await Team.create({
      name,
      university,
      skills,
      categories,
      location,
      available: available !== false,
    });

    return res.status(201).json({
      success: true,
      message: "Team added successfully",
      data: team,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get all teams
router.get("/", async (_req, res) => {
  try {
    const teams = await Team.find();

    return res.json({
      success: true,
      data: teams,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;