import React, { useState } from "react";
import api from "../api/axios";

function AddWorkout() {
  const [workoutTitle, setworkoutTitle] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [date, setDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const postData = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post("/api/workouts", {
        workoutTitle: workoutTitle,
        reps: reps,
        weight: weight,
        date: date,
      });
      alert("Workout added successfully!");
      window.location.reload(false);
    } catch (err) {
      console.log(err);
      alert("Failed to add workout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      {/* Card Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-primary-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add New Workout
        </h2>
      </div>

      {/* Card Body */}
      <div className="p-6">
        <form onSubmit={postData}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Workout Name */}
            <div>
              <label htmlFor="workoutTitle" className="label">
                Workout Name
              </label>
              <input
                id="workoutTitle"
                type="text"
                className="input-field"
                placeholder="e.g., Bench Press"
                value={workoutTitle}
                onChange={(e) => setworkoutTitle(e.target.value)}
                required
              />
            </div>

            {/* Weight */}
            <div>
              <label htmlFor="weight" className="label">
                Weight (lbs)
              </label>
              <input
                id="weight"
                type="number"
                className="input-field"
                placeholder="e.g., 135"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
              />
            </div>

            {/* Reps */}
            <div>
              <label htmlFor="reps" className="label">
                Number of Reps
              </label>
              <input
                id="reps"
                type="number"
                className="input-field"
                placeholder="e.g., 10"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                required
              />
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="label">
                Date
              </label>
              <input
                id="date"
                type="date"
                className="input-field"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="btn-primary w-full sm:w-auto"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Adding...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Workout
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddWorkout;
