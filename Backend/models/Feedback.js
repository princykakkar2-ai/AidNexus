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

function generateId() {
  return "fb-" + Math.random().toString(16).substring(2, 10);
}

const FeedbackProxy = {
  create: async function (data) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseFeedback.create(data);
    }
    const record = {
      _id: generateId(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    inMemoryFeedbacks.push(record);
    console.log("[Fallback DB] Created feedback:", record);
    return record;
  },

  find: function (query = {}) {
    if (mongoose.connection.readyState === 1) {
      return MongooseFeedback.find(query);
    }
    return {
      then: function (resolve) {
        // filter local inMemoryFeedbacks based on query.solution_id if applicable
        let results = [...inMemoryFeedbacks];
        if (query.solution_id) {
          results = results.filter(f => f.solution_id === query.solution_id);
        }
        return resolve(results);
      }
    };
  }
};

export default FeedbackProxy;
