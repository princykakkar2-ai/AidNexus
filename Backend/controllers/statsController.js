import Stat from "../models/Stat.js";

export async function getStats(req, res) {
  try {
    const stats = await Stat.find();
    return res.json({ success: true, data: stats });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
