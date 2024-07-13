const express = require("express");
const workouts = require("../models/workouts");

const workoutRouter = express.Router();

workoutRouter.get("/");

workoutRouter.get("/:id");

workoutRouter.post("/", async (req, res) => {
  const { workoutTitle, reps, weight, date } = req.body;

  try {
    const workout = await workouts.create({
      workoutTitle,
      reps,
      weight,
      date: new Date(date),
    });
    res.status(200).json(workout);
  } catch (error) {
    console.log(error);
    res.status(400).json("Unable to create workout");
  }
});

workoutRouter.patch("/:id");

module.exports = workoutRouter;
