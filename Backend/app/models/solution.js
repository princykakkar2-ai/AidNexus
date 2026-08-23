const mongoose = require("mongoose");

const solutionSchema = new mongoose.Schema({
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
  },

  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  title: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    required: true,
    trim: true,
  },

  technology: {
    type: String,
    default: "",
  },

  impact: {
    type: String,
    default: "",
  },

  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Approved", "Needs Improvement", "Rejected"],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Solution", solutionSchema);
