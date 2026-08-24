import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    university: {
      type: String,
      required: true,
      trim: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    categories: {
      type: [String],
      default: [],
    },

    location: {
      type: String,
      trim: true,
    },

    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Team", teamSchema);