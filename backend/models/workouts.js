const mongoose = require("mongoose");

// Schema for the workout details
const workouts = new mongoose.Schema({
  workoutTitle: {
    type: String,
    required: true,
  },
  reps: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("Workout", workouts);
