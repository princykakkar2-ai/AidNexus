import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "citizen", "expert"],
      default: "student",
    },
  },
  {
    timestamps: true,
  },
);

const MongooseUser = mongoose.model("User", userSchema);

import { generateId, makeQueryChain, wrapDocument } from "./fallbackHelper.js";

const inMemoryUsers = [
  {
    _id: "user-1",
    name: "Test Student",
    email: "student@test.com",
    password: "password",
    role: "student",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "user-2",
    name: "Test Citizen",
    email: "citizen@test.com",
    password: "password",
    role: "citizen",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "user-3",
    name: "Test Expert",
    email: "expert@test.com",
    password: "password",
    role: "expert",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const UserProxy = {
  create: async function (data) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseUser.create(data);
    }
    const existing = inMemoryUsers.find(u => u.email === data.email?.toLowerCase());
    if (existing) {
      throw new Error("User already exists");
    }
    const record = {
      _id: generateId("user-"),
      ...data,
      email: data.email?.toLowerCase(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    inMemoryUsers.push(record);
    console.log("[Fallback DB] Registered user:", record);
    return wrapDocument(record, inMemoryUsers);
  },

  findOne: async function (query) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseUser.findOne(query);
    }
    if (query && query.email) {
      const emailLower = query.email.toLowerCase();
      const record = inMemoryUsers.find(u => u.email === emailLower);
      return wrapDocument(record, inMemoryUsers);
    }
    return null;
  },

  find: function (query = {}) {
    if (mongoose.connection.readyState === 1) {
      return MongooseUser.find(query);
    }
    const mapped = inMemoryUsers.map(u => wrapDocument(u, inMemoryUsers));
    return makeQueryChain(mapped);
  }
};

export default UserProxy;