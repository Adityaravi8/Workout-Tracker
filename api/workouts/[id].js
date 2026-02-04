const connectDB = require("../lib/mongodb");
const Workout = require("../lib/workoutModel");

module.exports = async function handler(req, res) {
  await connectDB();

  const { id } = req.query;

  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, DELETE, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    try {
      const workout = await Workout.findById(id);
      if (!workout) {
        return res.status(404).json({ error: "Workout not found" });
      }
      return res.status(200).json(workout);
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch workout" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const workout = await Workout.findByIdAndDelete(id);
      if (!workout) {
        return res.status(404).json({ error: "Workout not found" });
      }
      return res.status(200).json({ message: "Workout deleted successfully" });
    } catch (err) {
      return res.status(500).json({ error: "Failed to delete workout" });
    }
  }

  if (req.method === "PATCH") {
    try {
      const workout = await Workout.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!workout) {
        return res.status(404).json({ error: "Workout not found" });
      }
      return res.status(200).json(workout);
    } catch (err) {
      return res.status(500).json({ error: "Failed to update workout" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
};
