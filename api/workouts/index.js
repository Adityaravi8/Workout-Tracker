const connectDB = require("../lib/mongodb");
const Workout = require("../lib/workoutModel");

module.exports = async function handler(req, res) {
  await connectDB();

  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    try {
      const workouts = await Workout.find().sort({ date: -1 });
      return res.status(200).json(workouts);
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch workouts" });
    }
  }

  if (req.method === "POST") {
    try {
      const { workoutTitle, reps, weight, date } = req.body;
      const workout = await Workout.create({
        workoutTitle,
        reps,
        weight,
        date: new Date(date),
      });
      return res.status(201).json(workout);
    } catch (err) {
      return res.status(400).json({ error: "Failed to create workout" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
};
