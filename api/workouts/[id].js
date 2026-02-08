const connectDB = require("../lib/mongodb");
const Workout = require("../lib/workoutModel");
const { verifyToken } = require("../lib/authMiddleware");
const { setSecurityHeaders } = require("../lib/securityHeaders");
const { verifyCsrfToken } = require("../lib/csrfUtils");

module.exports = async function handler(req, res) {
  const { id } = req.query;

  setSecurityHeaders(res, "GET, DELETE, PATCH, OPTIONS");

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
      const workout = await Workout.findOne({
        _id: id,
        userId: authResult.userId,
      });
      if (!workout) {
        return res.status(404).json({ error: "Workout not found" });
      }
      return res.status(200).json(workout);
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch workout" });
    }
  }

  if (req.method === "DELETE") {
    const csrfToken = req.headers["x-csrf-token"];
    if (!verifyCsrfToken(csrfToken, authResult.userId)) {
      return res.status(403).json({ error: "Invalid CSRF token" });
    }

    try {
      const workout = await Workout.findOneAndDelete({
        _id: id,
        userId: authResult.userId,
      });
      if (!workout) {
        return res.status(404).json({ error: "Workout not found" });
      }
      return res.status(200).json({ message: "Workout deleted successfully" });
    } catch (err) {
      return res.status(500).json({ error: "Failed to delete workout" });
    }
  }

  if (req.method === "PATCH") {
    const csrfToken = req.headers["x-csrf-token"];
    if (!verifyCsrfToken(csrfToken, authResult.userId)) {
      return res.status(403).json({ error: "Invalid CSRF token" });
    }

    try {
      const workout = await Workout.findOneAndUpdate(
        { _id: id, userId: authResult.userId },
        req.body,
        { new: true, runValidators: true },
      );
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
