import Problem from "../models/Problem.js";

export async function createProblem(req, res) {
  try {
    const { title, description, category, location, createdBy } = req.body;

    if (!title || !description || !category || !location) {
      return res.status(400).json({
        success: false,
        message: "title, description, category and location are required",
      });
    }

    const problem = await Problem.create({
      title,
      description,
      category,
      location,
      image: req.file ? `/uploads/problems/${req.file.filename}` : null,
      priority: "MEDIUM",
      status: "SUBMITTED",
      createdBy: createdBy || "anonymous",
    });

    return res.status(201).json({
      success: true,
      message: "Problem submitted successfully",
      data: problem,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getProblems(req, res) {
  try {
    const problems = await Problem.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: problems });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getProblemById(req, res) {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }

    return res.json({ success: true, data: problem });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Invalid problem id" });
  }
}

export async function deleteProblem(req, res) {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);

    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }

    return res.json({
      success: true,
      message: "Problem deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Invalid problem id" });
  }
}

export async function updateProblemStatus(req, res) {
  try {
    const { status, priority } = req.body;
    const { id } = req.params;

    const updates = {};
    if (status) updates.status = status;
    if (priority) updates.priority = priority;

    const problem = await Problem.findByIdAndUpdate(id, updates);

    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }

    return res.json({
      success: true,
      message: "Problem updated successfully",
      data: problem,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Invalid problem id or data" });
  }
}

