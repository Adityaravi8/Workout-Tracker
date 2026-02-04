import React, { useEffect, useState } from "react";
import axios from "axios";

function ViewWorkouts() {
  const [workouts, setWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingWorkout, setUpdatingWorkout] = useState(null);
  const [updatedWorkout, setUpdatedWorkout] = useState({
    workoutTitle: "",
    weight: "",
    reps: "",
    date: "",
  });

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/workoutRoutes/`)
      .then((res) => {
        setWorkouts(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);

  const handleUpdate = (e) => {
    const { name, value } = e.target;
    setUpdatedWorkout((prevWorkout) => ({
      ...prevWorkout,
      [name]: value,
    }));
  };

  const updateWorkout = (e) => {
    e.preventDefault();
    axios
      .patch(
        `${process.env.REACT_APP_API_URL}/api/workoutRoutes/${updatingWorkout}`,
        updatedWorkout
      )
      .then((res) => {
        setWorkouts((prevWorkouts) =>
          prevWorkouts.map((workout) =>
            workout._id === updatingWorkout ? res.data : workout
          )
        );
        alert("Workout updated successfully!");
        setUpdatingWorkout(null);
      })
      .catch((err) => {
        console.log(err);
        alert("Failed to update workout. Please try again.");
      });
  };

  const deleteWorkout = (id) => {
    if (!window.confirm("Are you sure you want to delete this workout?")) {
      return;
    }
    axios
      .delete(`${process.env.REACT_APP_API_URL}/api/workoutRoutes/${id}`)
      .then(() => {
        setWorkouts((prevWorkouts) =>
          prevWorkouts.filter((workout) => workout._id !== id)
        );
        alert("Workout deleted successfully!");
      })
      .catch((err) => {
        console.log(err);
        alert("Failed to delete workout. Please try again.");
      });
  };

  const startUpdatingWorkout = (workout) => {
    setUpdatingWorkout(workout._id);
    setUpdatedWorkout({
      workoutTitle: workout.workoutTitle,
      weight: workout.weight,
      reps: workout.reps,
      date: new Date(workout.date).toISOString().split("T")[0],
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          Your Workouts
        </h2>
      </div>

      {/* Card Body */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <svg
              className="animate-spin h-8 w-8 text-primary-500"
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
            <span className="ml-3 text-slate-600">Loading workouts...</span>
          </div>
        ) : workouts.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-slate-900">
              No workouts yet
            </h3>
            <p className="mt-2 text-slate-500">
              Get started by adding your first workout above.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">
                      Workout
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">
                      Weight
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">
                      Reps
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">
                      Date
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {workouts.map((workout) => (
                    <tr
                      key={workout._id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <span className="font-medium text-slate-900">
                          {workout.workoutTitle}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {workout.weight} lbs
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {workout.reps} reps
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-600">
                        {formatDate(workout.date)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => startUpdatingWorkout(workout)}
                            className="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="Edit workout"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteWorkout(workout._id)}
                            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete workout"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {workouts.map((workout) => (
                <div
                  key={workout._id}
                  className="bg-slate-50 rounded-lg p-4 border border-slate-200"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-slate-900">
                        {workout.workoutTitle}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {formatDate(workout.date)}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => startUpdatingWorkout(workout)}
                        className="p-2 text-slate-500 hover:text-primary-600 hover:bg-white rounded-lg transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteWorkout(workout._id)}
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {workout.weight} lbs
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {workout.reps} reps
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      {updatingWorkout && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
              onClick={() => setUpdatingWorkout(null)}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-modal w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">
                  Edit Workout
                </h3>
                <button
                  onClick={() => setUpdatingWorkout(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={updateWorkout} className="space-y-4">
                <div>
                  <label htmlFor="editTitle" className="label">
                    Workout Name
                  </label>
                  <input
                    id="editTitle"
                    type="text"
                    name="workoutTitle"
                    className="input-field"
                    value={updatedWorkout.workoutTitle}
                    onChange={handleUpdate}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="editWeight" className="label">
                    Weight (lbs)
                  </label>
                  <input
                    id="editWeight"
                    type="number"
                    name="weight"
                    className="input-field"
                    value={updatedWorkout.weight}
                    onChange={handleUpdate}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="editReps" className="label">
                    Number of Reps
                  </label>
                  <input
                    id="editReps"
                    type="number"
                    name="reps"
                    className="input-field"
                    value={updatedWorkout.reps}
                    onChange={handleUpdate}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="editDate" className="label">
                    Date
                  </label>
                  <input
                    id="editDate"
                    type="date"
                    name="date"
                    className="input-field"
                    value={updatedWorkout.date}
                    onChange={handleUpdate}
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setUpdatingWorkout(null)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewWorkouts;
