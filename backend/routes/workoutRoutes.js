const express = require("express");
const {
  createWorkout,
  getAllWorkouts,
  getSingleWorkout,
  deleteSingleWorkout,
  updateWorkout,
} = require("../controllers/workoutController");

const workoutRouter = express.Router();

// Routers
workoutRouter.get("/", getAllWorkouts);

workoutRouter.get("/:id", getSingleWorkout);

workoutRouter.post("/", createWorkout);

workoutRouter.delete("/:id", deleteSingleWorkout);
workoutRouter.patch("/:id", updateWorkout);

module.exports = workoutRouter;
