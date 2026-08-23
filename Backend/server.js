import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "node:path";

import { connectDB } from "./config/db.js";

import problemRoutes from "./routes/problemRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import expertRoutes from "./routes/expertRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.resolve("uploads")));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "AidNexus Backend is running",
  });
});

// Root route
app.get("/", (_req, res) => {
  res.send("AidNexus Backend is running! Access APIs at /api/*");
});

// API routes
app.use("/api/problems", problemRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/feedback", feedbackRoutes);

// Industry / Expert module
app.use("/api/expert", expertRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// Connect database and start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);

    console.log("Starting server in FALLBACK mode...");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT} (FALLBACK MODE)`);
    });
  });
