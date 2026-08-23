import mongoose from "mongoose";

const statSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    number: { type: String, required: true },
    label: { type: String, required: true },
    increase: { type: String, required: true }
  },
  { timestamps: true }
);

const MongooseStat = mongoose.model("Stat", statSchema);

// In-memory fallback database for when MongoDB is offline
const inMemoryStats = [
  { _id: "stat-1", key: "totalProblems", number: "128", label: "Total Problems", increase: "12%" },
  { _id: "stat-2", key: "solutionsSubmitted", number: "76", label: "Solutions Submitted", increase: "18%" },
  { _id: "stat-3", key: "activeProjects", number: "42", label: "Active Projects", increase: "15%" },
  { _id: "stat-4", key: "industryExperts", number: "18", label: "Industry Experts", increase: "5%" },
  { _id: "stat-5", key: "aiResolution", number: "78%", label: "AI Resolution Score", increase: "10%" }
];

const StatProxy = {
  find: async function () {
    if (mongoose.connection.readyState === 1) {
      try {
        const dbStats = await MongooseStat.find();
        if (dbStats.length === 0) {
          // Seed database
          const seedData = inMemoryStats.map(({ _id, ...rest }) => rest);
          await MongooseStat.insertMany(seedData);
          return await MongooseStat.find();
        }
        return dbStats;
      } catch (err) {
        console.error("Error fetching/seeding stats in database:", err.message);
        return inMemoryStats;
      }
    }
    return inMemoryStats;
  }
};

export default StatProxy;
