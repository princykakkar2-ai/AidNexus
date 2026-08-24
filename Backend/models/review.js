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

const MongooseReview = mongoose.model("Review", reviewSchema);

import { generateId, makeQueryChain, wrapDocument } from "./fallbackHelper.js";

const inMemoryReviews = [];

class ReviewProxy {
  constructor(data) {
    if (mongoose.connection.readyState === 1) {
      return new MongooseReview(data);
    }
    this._data = {
      _id: generateId("rev-"),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    Object.assign(this, this._data);
  }

  async save() {
    const idx = inMemoryReviews.findIndex(r => r._id === this._data._id);
    if (idx !== -1) {
      const { save, ...restThis } = this;
      inMemoryReviews[idx] = { ...inMemoryReviews[idx], ...restThis, updatedAt: new Date() };
      console.log("[Fallback DB] Saved review:", inMemoryReviews[idx]);
    } else {
      inMemoryReviews.push(this._data);
      console.log("[Fallback DB] Created review:", this._data);
    }
    return this;
  }

  static find(query = {}) {
    if (mongoose.connection.readyState === 1) {
      return MongooseReview.find(query);
    }
    let results = inMemoryReviews.map(r => wrapDocument(r, inMemoryReviews));
    if (query.solutionId) {
      results = results.filter(r => r.solutionId === query.solutionId);
    }
    return makeQueryChain(results);
  }

  static async create(data) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseReview.create(data);
    }
    const record = {
      _id: generateId("rev-"),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    inMemoryReviews.push(record);
    console.log("[Fallback DB] Created review:", record);
    return wrapDocument(record, inMemoryReviews);
  }
}

export default ReviewProxy;
