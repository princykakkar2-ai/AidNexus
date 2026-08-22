import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
    },
    summary: {
      type: String,
      default: "",
      trim: true,
    },
    duplicate: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["SUBMITTED", "UNDER_REVIEW", "IN_PROGRESS", "RESOLVED", "REJECTED"],
      default: "SUBMITTED",
    },
    createdBy: {
      type: String,
      default: "anonymous",
      trim: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } },
);

export default mongoose.model("Problem", problemSchema);
