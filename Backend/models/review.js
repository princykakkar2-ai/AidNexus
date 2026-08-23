import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    solutionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Solution",
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
      enum: ["APPROVED", "REJECTED", "NEEDS_IMPROVEMENT"],
    },
  },
  {
    timestamps: true,
  },
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
