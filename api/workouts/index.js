const connectDB = require("../../lib/mongodb");
const Workout = require("../../lib/workoutModel");
const { verifyToken } = require("../../lib/authMiddleware");
const { setSecurityHeaders } = require("../../lib/securityHeaders");
const { verifyCsrfToken } = require("../../lib/csrfUtils");

module.exports = async function handler(req, res) {
  setSecurityHeaders(res, "GET, POST, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const authResult = verifyToken(req);
  if (authResult.error) {
    return res.status(authResult.status).json({ error: authResult.error });
  }

  await connectDB();

  if (req.method === "GET") {
    try {
      const workouts = await Workout.find({ userId: authResult.userId }).sort({
        date: -1,
      });
      return res.status(200).json(workouts);
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch workouts" });
    }
  }

  if (req.method === "POST") {
    const csrfToken = req.headers["x-csrf-token"];
    if (!verifyCsrfToken(csrfToken, authResult.userId)) {
      return res.status(403).json({ error: "Invalid CSRF token" });
    }

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
