import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    solution_id: {
      type: String,
      required: true,
    },
    expert_id: {
      type: String,
      default: "expert-anonymous",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    feedback_text: {
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
    },
  },
  { timestamps: true }
);

const MongooseFeedback = mongoose.model("Feedback", feedbackSchema);

// In-memory fallback feedbacks
const inMemoryFeedbacks = [
  {
    _id: "fb-1",
    solution_id: "sol-1",
    expert_id: "expert-1",
    rating: 4,
    feedback_text: "Great implementation. Consider refining the machine learning model deployment.",
    suggestions: "Optimize the image preprocessing size.",
    status: "UNDER_REVIEW",
    createdAt: new Date(Date.now() - 3600000 * 24),
    updatedAt: new Date(Date.now() - 3600000 * 24),
  }
];

import { generateId, makeQueryChain, wrapDocument } from "./fallbackHelper.js";

const FeedbackProxy = {
  create: async function (data) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseFeedback.create(data);
    }
    const record = {
      _id: generateId("fb-"),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    inMemoryFeedbacks.push(record);
    console.log("[Fallback DB] Created feedback:", record);
    return wrapDocument(record, inMemoryFeedbacks);
  },

  find: function (query = {}) {
    if (mongoose.connection.readyState === 1) {
      return MongooseFeedback.find(query);
    }
    let results = inMemoryFeedbacks.map(f => wrapDocument(f, inMemoryFeedbacks));
    if (query.solution_id) {
      results = results.filter(f => f.solution_id === query.solution_id);
    }
    return makeQueryChain(results);
  }
};

export default FeedbackProxy;
