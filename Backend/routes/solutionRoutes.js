const express = require("express");
const Solution = require("../models/Solution");

const router = express.Router();

// Get all solutions
router.get("/", async (req, res) => {
    try {
        const solutions = await Solution.find()
            .populate("problemId");

        res.status(200).json(solutions);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch solutions",
            error: error.message
        });
    }
});

// Get one solution
router.get("/:id", async (req, res) => {
    try {
        const solution = await Solution.findById(req.params.id)
            .populate("problemId");

        if (!solution) {
            return res.status(404).json({
                message: "Solution not found"
            });
        }

        res.status(200).json(solution);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch solution",
            error: error.message
        });
    }
});

// Submit solution
router.post("/", async (req, res) => {
    try {
        const solution = await Solution.create(req.body);

        res.status(201).json({
            message: "Solution submitted successfully",
            solution
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to submit solution",
            error: error.message
        });
    }
});

module.exports = router;