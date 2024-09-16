const workouts = require("../models/workouts");

// Function to create a workout
const createWorkout = async (req, res) => {
  const { workoutTitle, reps, weight, date } = req.body;

  try {
    workouts.create({
      workoutTitle,
      reps,
      weight,
      date: new Date(date),
    });
    res.status(200).json({ mssg: "Successfully created workout" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: "Unable to create workout" });
  }
};
// Function to fetch all workouts from database
const getAllWorkouts = (req, res) => {
  workouts
    .find()
    .then((getWorkouts) => res.json(getWorkouts))
    .catch((err) => res.json({ err: "Workout does not exist" }));
};

// Function to fetch a single workout
const getSingleWorkout = (req, res) => {
  const { id } = req.params;

  workouts
    .findById(id)
    .then((getWorkout) => res.json(getWorkout))
    .catch((err) => res.json({ err: "Workout does not exist" }));
};

// Function to delete a single workout
const deleteSingleWorkout = (req, res) => {
  const { id } = req.params;

  workouts
    .findByIdAndDelete(id)
    .then((mssg) => res.json({ mssg: "Workout deleted successfully" }))
    .catch((err) => res.json({ err: "Unable to delete workout" }));
};
// Function to update an existing workout
const updateWorkout = (req, res) => {
  const { id } = req.params;

  workouts
    .findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    .then((updatedWorkout) => {
      if (!updatedWorkout) {
        return res.status(404).json({ error: "Workout not found" });
      }
      res.json(updatedWorkout);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Unable to update workout" });
    });
};
module.exports = {
  createWorkout,
  getAllWorkouts,
  getSingleWorkout,
  deleteSingleWorkout,
  updateWorkout,
};
