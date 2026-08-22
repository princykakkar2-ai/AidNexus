const express = require("express");
const Problem = require("../models/Problem");

const router = express.Router();

// Get all problems
router.get("/", async (req, res) => {
    try {
        const problems = await Problem.find();

        res.status(200).json(problems);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch problems",
            error: error.message
        });
    }
});

// Get one problem
router.get("/:id", async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);

        if (!problem) {
            return res.status(404).json({
                message: "Problem not found"
            });
        }

        res.status(200).json(problem);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch problem",
            error: error.message
        });
    }
});

// Create problem
router.post("/", async (req, res) => {
    try {
        const problem = await Problem.create(req.body);

        res.status(201).json(problem);
    } catch (error) {
        res.status(400).json({
            message: "Failed to create problem",
            error: error.message
        });
    }
});

module.exports = router;