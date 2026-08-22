const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  solutionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Solution",
    required: true,
  },

  expertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },

  feedback: {
    type: String,
    required: true,
    trim: true,
  },

  suggestions: {
    type: String,
    default: "",
    trim: true,
  },

  status: {
    type: String,
    required: true,
    enum: ["Approved", "Needs Improvement", "Rejected"],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Review", reviewSchema);
