const connectDB = require("../lib/mongodb");
const Workout = require("../lib/workoutModel");
const { verifyToken } = require("../lib/authMiddleware");

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Verify authentication
  const authResult = verifyToken(req);
  if (authResult.error) {
    return res.status(authResult.status).json({ error: authResult.error });
  }

  await connectDB();

  if (req.method === "GET") {
    try {
      const workouts = await Workout.find({ userId: authResult.userId }).sort({ date: -1 });
      return res.status(200).json(workouts);
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch workouts" });
    }
  }

  if (req.method === "POST") {
    try {
      const { workoutTitle, reps, weight, date } = req.body;
      const workout = await Workout.create({
        userId: authResult.userId,
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
