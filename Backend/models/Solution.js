import mongoose from "mongoose";

const solutionSchema = new mongoose.Schema(
  {
    project_title: {
      type: String,
      required: true,
      trim: true,
    },
    problem_description: {
      type: String,
      required: true,
      trim: true,
    },
    student_name: {
      type: String,
      required: true,
      trim: true,
    },
    student_email: {
      type: String,
      required: true,
      trim: true,
    },
    solution_description: {
      type: String,
      required: true,
      trim: true,
    },
    technologies: {
      type: String,
      default: "",
    },
    github_link: {
      type: String,
      default: "",
    },
    demo_link: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["UNDER_REVIEW", "APPROVED", "REJECTED", "NEEDS_IMPROVEMENT"],
      default: "UNDER_REVIEW",
    },
  },
  { timestamps: true }
);

const MongooseSolution = mongoose.model("Solution", solutionSchema);

// In-memory fallback solutions
const inMemorySolutions = [
  {
    _id: "sol-1",
    project_title: "Smart Waste Classifier",
    problem_description: "Efficient garbage collection in urban areas using local bins.",
    student_name: "John Doe",
    student_email: "john@university.edu",
    solution_description: "IoT enabled bins that classify garbage automatically using ML.",
    technologies: "React, Node.js, TensorFlow Lite",
    github_link: "https://github.com/example/waste-classifier",
    demo_link: "https://demo.example.com",
    status: "UNDER_REVIEW",
    createdAt: new Date(Date.now() - 3600000 * 48),
    updatedAt: new Date(Date.now() - 3600000 * 48),
  },
  {
    _id: "sol-2",
    project_title: "Acoustic Water Leakage Detector",
    problem_description: "Identify and reduce water leakage in public pipelines.",
    student_name: "Jane Smith",
    student_email: "jane@university.edu",
    solution_description: "Acoustic sensor network that listens for pipe vibrations and reports coordinates.",
    technologies: "Python, Raspberry Pi, LoRaWAN",
    github_link: "https://github.com/example/water-leakage",
    demo_link: "https://demo.example.com/leakage",
    status: "APPROVED",
    createdAt: new Date(Date.now() - 3600000 * 24),
    updatedAt: new Date(Date.now() - 3600000 * 24),
  }
];

import { generateId, makeQueryChain, wrapDocument } from "./fallbackHelper.js";

const SolutionProxy = {
  create: async function (data) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseSolution.create(data);
    }
    const record = {
      _id: generateId("sol-"),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    inMemorySolutions.push(record);
    console.log("[Fallback DB] Created solution:", record);
    return wrapDocument(record, inMemorySolutions);
  },

  find: function () {
    if (mongoose.connection.readyState === 1) {
      return MongooseSolution.find();
    }
    const mapped = inMemorySolutions.map(s => wrapDocument(s, inMemorySolutions));
    return makeQueryChain(mapped);
  },

  findById: async function (id) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseSolution.findById(id);
    }
    const record = inMemorySolutions.find(s => s._id === id);
    return wrapDocument(record, inMemorySolutions);
  },

  findByIdAndUpdate: async function (id, update, options = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseSolution.findByIdAndUpdate(id, update, { new: true, ...options });
    }
    const index = inMemorySolutions.findIndex(s => s._id === id);
    if (index !== -1) {
      let mergedUpdate = { ...update };
      if (update.$set) mergedUpdate = { ...mergedUpdate, ...update.$set };
      delete mergedUpdate.$set;

      const updated = { 
        ...inMemorySolutions[index], 
        ...mergedUpdate, 
        updatedAt: new Date() 
      };
      inMemorySolutions[index] = updated;
      console.log("[Fallback DB] Updated solution:", updated);
      return wrapDocument(updated, inMemorySolutions);
    }
    return null;
  }
};

export default SolutionProxy;
