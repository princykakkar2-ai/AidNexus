import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "node:path";

import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";
import solutionRoutes from "./routes/solutionRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import expertRoutes from "./routes/expertRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Uploaded files
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

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/solutions", solutionRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/stats", statsRoutes);

// Industry / Expert module
app.use("/api/expert", expertRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error("Unhandled Error:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// Connect DB and start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);

    console.log(
      "Starting server in FALLBACK (offline in-memory) mode..."
    );

    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT} (FALLBACK MODE)`
      );
    });
  });