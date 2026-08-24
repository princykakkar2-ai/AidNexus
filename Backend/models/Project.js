import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    problemId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    teamName: {
      type: String,
      required: true,
      trim: true,
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    status: {
      type: String,
      enum: ["IN_PROGRESS", "COMPLETED"],
      default: "IN_PROGRESS",
    },
    supportNeeded: {
      type: [String],
      default: [],
    },
    industryPartner: {
      type: String,
      default: null,
      trim: true,
    },
    industrySupport: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const MongooseProject = mongoose.model("Project", projectSchema);

// In-memory fallback database for when MongoDB is offline
const inMemoryProjects = [
  {
    _id: "proj-1",
    problemId: "mock-1",
    title: "Damaged Pothole on Main Street",
    teamName: "SmartTech ABC",
    progress: 40,
    status: "IN_PROGRESS",
    supportNeeded: ["Funding", "Equipment"],
    industryPartner: null,
    industrySupport: [],
    createdAt: new Date(Date.now() - 3600000 * 12),
    updatedAt: new Date(Date.now() - 3600000 * 12),
  }
];

import { generateId, makeQueryChain, wrapDocument } from "./fallbackHelper.js";

const ProjectProxy = {
  create: async function (data) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseProject.create(data);
    }
    const record = {
      _id: generateId("proj-"),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    inMemoryProjects.push(record);
    console.log("[Fallback DB] Created project:", record);
    return wrapDocument(record, inMemoryProjects);
  },

  find: function () {
    if (mongoose.connection.readyState === 1) {
      return MongooseProject.find();
    }
    const mapped = inMemoryProjects.map(p => wrapDocument(p, inMemoryProjects));
    return makeQueryChain(mapped);
  },

  findById: async function (id) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseProject.findById(id);
    }
    const record = inMemoryProjects.find(p => p._id === id);
    return wrapDocument(record, inMemoryProjects);
  },

  findByIdAndUpdate: async function (id, update, options = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseProject.findByIdAndUpdate(id, update, { new: true, ...options });
    }
    const index = inMemoryProjects.findIndex(p => p._id === id);
    if (index !== -1) {
      let mergedUpdate = { ...update };
      if (update.$set) mergedUpdate = { ...mergedUpdate, ...update.$set };
      delete mergedUpdate.$set;

      const updated = { 
        ...inMemoryProjects[index], 
        ...mergedUpdate, 
        updatedAt: new Date() 
      };
      inMemoryProjects[index] = updated;
      console.log("[Fallback DB] Updated project:", updated);
      return wrapDocument(updated, inMemoryProjects);
    }
    return null;
  }
};

export default ProjectProxy;
