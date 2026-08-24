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
    _id: "SIH-1260-A",
    title: "Pothole Detection & Rapid Patch System",
    description: "Multiple deep potholes on Main Ring Road causing severe traffic congestion, damage to public transit vehicles, and minor accidents daily during rush hour. Awaiting rapid asphalt patch & AI road scan prototype.",
    category: "Infrastructure",
    location: "Ward 12, New Delhi",
    priority: "HIGH",
    status: "IN_PROGRESS",
    createdBy: "Ward 12 Resident Welfare",
    votes: 342,
    createdAt: new Date(Date.now() - 3600000 * 48),
    updatedAt: new Date(Date.now() - 3600000 * 24)
  },
  {
    _id: "SIH-1260-B",
    title: "Solar Micro-Grid for Rural Schools",
    description: "Rural primary school lacking continuous electricity supply, disrupting digital classrooms and computer lab operations. Proposal for smart microgrid battery storage system.",
    category: "Electricity",
    location: "Ward 3, Pune District",
    priority: "MEDIUM",
    status: "UNDER_REVIEW",
    createdBy: "School Management Committee",
    votes: 289,
    createdAt: new Date(Date.now() - 3600000 * 36),
    updatedAt: new Date(Date.now() - 3600000 * 18)
  },
  {
    _id: "SIH-1260-C",
    title: "AI Water Leak Detection Network",
    description: "Main pipeline leakage leading to wastage of thousands of liters of clean drinking water daily. AI acoustic sensor network and pressure logging suggested for rapid pinpointing.",
    category: "Environment",
    location: "Zone B, Bengaluru South",
    priority: "MEDIUM",
    status: "SUBMITTED",
    createdBy: "South Bengaluru Citizen Forum",
    votes: 210,
    createdAt: new Date(Date.now() - 3600000 * 24),
    updatedAt: new Date(Date.now() - 3600000 * 12)
  },
  {
    _id: "SIH-1260-D",
    title: "E-Waste Disposal Smart Bin Network",
    description: "Lack of dedicated e-waste recycling bins leading to hazardous disposal of mercury and lithium batteries in municipal waste streams. Smart bin sensor and collection route optimization required.",
    category: "Waste Management",
    location: "Sector 62, Noida",
    priority: "LOW",
    status: "SUBMITTED",
    createdBy: "Sector 62 Green Committee",
    votes: 195,
    createdAt: new Date(Date.now() - 3600000 * 16),
    updatedAt: new Date(Date.now() - 3600000 * 8)
  },
  {
    _id: "SIH-1260-E",
    title: "Rural Clinic Telemedicine System",
    description: "No specialist doctor visits in remote hilly terrain. High-bandwidth digital diagnostic telemetry terminal needed to connect primary clinics with AIIMS specialists.",
    category: "Healthcare",
    location: "Village Palampur, HP",
    priority: "HIGH",
    status: "UNDER_REVIEW",
    createdBy: "Community Health Center",
    votes: 180,
    createdAt: new Date(Date.now() - 3600000 * 10),
    updatedAt: new Date(Date.now() - 3600000 * 4)
  },
  {
    _id: "SIH-1260-F",
    title: "Smart Streetlight Grid Control",
    description: "Streetlights remaining active in broad daylight, causing significant grid energy waste. Need automated ambient light level sensor arrays and central timer dashboard.",
    category: "Infrastructure",
    location: "Gachibowli, Hyderabad",
    priority: "LOW",
    status: "SUBMITTED",
    createdBy: "Cyberabad Civic Association",
    votes: 154,
    createdAt: new Date(Date.now() - 3600000 * 4),
    updatedAt: new Date(Date.now() - 3600000 * 1)
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
