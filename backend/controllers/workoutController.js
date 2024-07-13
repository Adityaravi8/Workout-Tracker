const workouts = require("../models/workouts");

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

const getAllWorkouts = (req, res) => {
  workouts
    .find()
    .then((getWorkouts) => res.json(getWorkouts))
    .catch((err) => res.json({ err: "Workout does not exist" }));
};

const getSingleWorkout = (req, res) => {
  const { id } = req.params;

  workouts
    .findById(id)
    .then((getWorkout) => res.json(getWorkout))
    .catch((err) => res.json({ err: "Workout does not exist" }));
};

const deleteSingleWorkout = (req, res) => {
  const { id } = req.params;

  workouts
    .findByIdAndDelete(id)
    .then((mssg) => res.json({ mssg: "Workout deleted successfully" }))
    .catch((err) => res.json({ err: "Unable to delete workout" }));
};

const updateWorkout = (req, res) => {
  const { id } = req.params;

  workouts
    .findByIdAndUpdate(
      { _id: id },
      {
        ...req.body,
      }
    )
    .then((mssg) => res.json({ mssg: "Workout updated successfully" }))
    .catch((err) => res.json({ err: "Unable to update workout" }));
};
module.exports = {
  createWorkout,
  getAllWorkouts,
  getSingleWorkout,
  deleteSingleWorkout,
  updateWorkout,
};
