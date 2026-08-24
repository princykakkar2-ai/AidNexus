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

const MongooseProblem = mongoose.model("Problem", problemSchema);

// In-memory fallback database for when MongoDB is offline
const inMemoryDb = [
  {
    _id: "mock-1",
    title: "Damaged Pothole on Main Street",
    description: "Large pothole causing traffic issues and potential vehicle damage near intersection.",
    category: "Roads",
    location: "Main Street & 5th Ave",
    priority: "HIGH",
    status: "IN_PROGRESS",
    createdBy: "citizen1",
    createdAt: new Date(Date.now() - 3600000 * 24),
    updatedAt: new Date(Date.now() - 3600000 * 24)
  },
  {
    _id: "mock-2",
    title: "Broken Streetlight on Elm Road",
    description: "The streetlight near house 42 has been flickering and is now completely out.",
    category: "Electricity",
    location: "42 Elm Road",
    priority: "MEDIUM",
    status: "SUBMITTED",
    createdBy: "citizen2",
    createdAt: new Date(Date.now() - 3600000 * 2),
    updatedAt: new Date(Date.now() - 3600000 * 2)
  }
];

import { generateId, makeQueryChain, wrapDocument } from "./fallbackHelper.js";

const ProblemProxy = {
  create: async function (data) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseProblem.create(data);
    }
    const record = {
      _id: generateId("prob-"),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    inMemoryDb.push(record);
    console.log("[Fallback DB] Created problem:", record);
    return wrapDocument(record, inMemoryDb);
  },

  find: function () {
    if (mongoose.connection.readyState === 1) {
      return MongooseProblem.find();
    }
    const mapped = inMemoryDb.map(p => wrapDocument(p, inMemoryDb));
    return makeQueryChain(mapped);
  },

  findById: async function (id) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseProblem.findById(id);
    }
    const record = inMemoryDb.find(r => r._id === id);
    return wrapDocument(record, inMemoryDb);
  },

  findByIdAndUpdate: async function (id, update, options = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseProblem.findByIdAndUpdate(id, update, { new: true, ...options });
    }
    const index = inMemoryDb.findIndex(r => r._id === id);
    if (index !== -1) {
      let mergedUpdate = { ...update };
      if (update.$set) mergedUpdate = { ...mergedUpdate, ...update.$set };
      delete mergedUpdate.$set;

      const updated = { 
        ...inMemoryDb[index], 
        ...mergedUpdate, 
        updatedAt: new Date() 
      };
      inMemoryDb[index] = updated;
      console.log("[Fallback DB] Updated problem:", updated);
      return wrapDocument(updated, inMemoryDb);
    }
    return null;
  },

  findByIdAndDelete: async function (id) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseProblem.findByIdAndDelete(id);
    }
    const index = inMemoryDb.findIndex(r => r._id === id);
    if (index !== -1) {
      const deleted = inMemoryDb.splice(index, 1)[0];
      return wrapDocument(deleted, inMemoryDb);
    }
    return null;
  }
};

export default ProblemProxy;
