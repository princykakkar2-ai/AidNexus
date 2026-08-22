import Problem from "../models/Problem.js";

export async function createProblem(req, res) {
  try {
    const { title, description, location, createdBy } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({
        success: false,
        message: "title, description and location are required",
      });
    }

    // Send problem to AI service
    let aiData = {
      category: "Other",
      priority: "MEDIUM",
      summary: description.slice(0, 100) + "...",
      duplicate: false
    };

    try {
      const aiResponse = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      if (aiResponse.ok) {
        aiData = await aiResponse.json();
      }
    } catch (err) {
      console.warn("AI service not reachable, utilizing fallback classification.");
    }

    const problem = await Problem.create({
      title,
      description,
      category: aiData.category,
      location,
      image: req.file ? `/uploads/problems/${req.file.filename}` : null,
      priority: aiData.priority.toUpperCase(),
      summary: aiData.summary,
      duplicate: aiData.duplicate,
      status: "SUBMITTED",
      createdBy: createdBy || "anonymous",
    });

    return res.status(201).json({
      success: true,
      message: "Problem submitted successfully",
      data: problem,
      ai: {
        summary: aiData.summary,
        duplicate: aiData.duplicate,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
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
