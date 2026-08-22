const Solution = require("../models/Solution");

const getExpertSolutions = async (req, res) => {
  try {
    const solutions = await Solution.find({
      status: "Pending",
    }).sort({ createdAt: -1 });

    const result = solutions.map((solution) => ({
      id: solution._id,
      project_title: solution.title,
      student_name: solution.submittedBy,
      problem_description: solution.description,
      status: solution.status,
      technologies: solution.technology,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching expert solutions:", error);

    res.status(500).json({
      message: "Failed to fetch solutions",
    });
  }
};

module.exports = {
  getExpertSolutions,
};
