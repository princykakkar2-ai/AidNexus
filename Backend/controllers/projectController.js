import Project from "../models/Project.js";
import Problem from "../models/Problem.js";

export async function getProjects(req, res) {
  try {
    const projects = await Project.find();
    return res.json({ success: true, data: projects });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function createProject(req, res) {
  try {
    const { problemId, title, teamName, supportNeeded } = req.body;

    if (!problemId || !title || !teamName) {
      return res.status(400).json({
        success: false,
        message: "problemId, title and teamName are required",
      });
    }

    // Create project
    const project = await Project.create({
      problemId,
      title,
      teamName,
      supportNeeded: supportNeeded || [],
      progress: 0,
      status: "IN_PROGRESS",
    });

    // Update corresponding problem status to IN_PROGRESS
    try {
      await Problem.findByIdAndUpdate(problemId, { status: "IN_PROGRESS" });
    } catch (err) {
      console.error("Failed to update problem status:", err.message);
    }

    return res.status(201).json({
      success: true,
      message: "Project created and team assigned successfully",
      data: project,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateProjectProgress(req, res) {
  try {
    const { progress, status } = req.body;
    const { id } = req.params;

    if (progress === undefined && !status) {
      return res.status(400).json({
        success: false,
        message: "Either progress or status must be provided",
      });
    }

    const updates = {};
    if (progress !== undefined) updates.progress = Number(progress);
    if (status) updates.status = status;

    const project = await Project.findByIdAndUpdate(id, updates);

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // If project is marked COMPLETED, update problem status to RESOLVED
    if (status === "COMPLETED") {
      try {
        await Problem.findByIdAndUpdate(project.problemId, { status: "RESOLVED" });
      } catch (err) {
        console.error("Failed to resolve problem status:", err.message);
      }
    }

    return res.json({
      success: true,
      message: "Project progress updated successfully",
      data: project,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function offerIndustrySupport(req, res) {
  try {
    const { industryPartner, industrySupport } = req.body;
    const { id } = req.params;

    if (!industryPartner || !industrySupport || !Array.isArray(industrySupport)) {
      return res.status(400).json({
        success: false,
        message: "industryPartner and list of support items are required",
      });
    }

    const project = await Project.findByIdAndUpdate(id, {
      industryPartner,
      industrySupport,
    });

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    return res.json({
      success: true,
      message: "Support offered successfully to this project",
      data: project,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
