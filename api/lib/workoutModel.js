const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
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

module.exports = mongoose.models.Workout || mongoose.model("Workout", workoutSchema);
