import React, { useState } from "react";
import api from "../api/axios";

function AddWorkout({ onWorkoutAdded }) {
  const [workoutTitle, setworkoutTitle] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [date, setDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alertModal, setAlertModal] = useState({ show: false, message: "", type: "success" });

  const showAlert = (message, type = "success") => {
    setAlertModal({ show: true, message, type });
  };

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
      showAlert("Workout added successfully!", "success");
      setworkoutTitle("");
      setWeight("");
      setReps("");
      setDate("");
      if (onWorkoutAdded) onWorkoutAdded();
    } catch (err) {
      console.log(err);
      showAlert("Failed to add workout. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
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

      <div className="p-6">
        <form onSubmit={postData}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      {alertModal.show && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
              onClick={() => setAlertModal({ ...alertModal, show: false })}
            />
            <div className="relative bg-white rounded-xl shadow-modal w-full max-w-sm p-6 text-center">
              <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                alertModal.type === "success" ? "bg-green-100" : "bg-red-100"
              }`}>
                {alertModal.type === "success" ? (
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${
                alertModal.type === "success" ? "text-green-800" : "text-red-800"
              }`}>
                {alertModal.type === "success" ? "Success" : "Error"}
              </h3>
              <p className="text-slate-600 mb-6">{alertModal.message}</p>
              <button
                onClick={() => setAlertModal({ ...alertModal, show: false })}
                className={`w-full py-2.5 px-4 rounded-lg font-medium text-white transition-colors ${
                  alertModal.type === "success"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddWorkout;
