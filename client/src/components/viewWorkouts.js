import React, { useEffect, useState } from "react";
import axios from "axios";
import "./viewWorkouts.css";

function ViewWorkouts() {
  const [workouts, setWorkouts] = useState([]);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [updatedWorkout, setUpdatedWorkout] = useState({
    workoutTitle: "",
    weight: "",
    reps: "",
    date: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/workoutRoutes/")
      .then((res) => {
        console.log("Fetched Workouts:", res.data);
        setWorkouts(res.data);
      })
      .catch((err) => console.log(err));
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
        `http://localhost:4000/api/workoutRoutes/${editingWorkout}`,
        updatedWorkout
      )
      .then((res) => {
        console.log("Update response:", res.data);
        setWorkouts((prevWorkouts) =>
          prevWorkouts.map((workout) =>
            workout._id === editingWorkout ? res.data : workout
          )
        );
        alert("Workout updated successfully!");
        setEditingWorkout(null);
      })
      .catch((err) => {
        console.log("Error updating workout:", err);
      });
  };
  const deleteWorkout = (id) => {
    axios
      .delete(`http://localhost:4000/api/workoutRoutes/${id}`)
      .then((res) => console.log("Successfully deleted workout"))
      .catch((err) => console.log(err));
    alert("Success");
    window.location.reload(false);
  };

  const startEditingWorkout = (workout) => {
    setEditingWorkout(workout._id);
    setUpdatedWorkout({
      workoutTitle: workout.workoutTitle,
      weight: workout.weight,
      reps: workout.reps,
      date: new Date(workout.date).toISOString().split("T")[0],
    });
  };

  return (
    <div className="container">
      <table className="table-field">
        <thead>
          <tr>
            <th>Workout Name</th>
            <th>Weight</th>
            <th>Reps</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {workouts.map((workout) => (
            <tr key={workout._id}>
              <td>{workout.workoutTitle}</td>
              <td>{workout.weight}</td>
              <td>{workout.reps}</td>
              <td>{workout.date}</td>
              <td>
                <button onClick={() => deleteWorkout(workout._id)}>
                  Delete
                </button>
                <button onClick={() => startEditingWorkout(workout)}>
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingWorkout && (
        <div className="edit-form">
          <h3>Edit Workout</h3>
          <form onSubmit={updateWorkout}>
            <div className="form-row">
              <label>Workout Title</label>
              <input
                type="text"
                name="workoutTitle"
                value={updatedWorkout.workoutTitle}
                onChange={handleUpdate}
                required
              />
            </div>
            <div className="form-row">
              <label>Weight</label>
              <input
                type="number"
                name="weight"
                value={updatedWorkout.weight}
                onChange={handleUpdate}
                required
              />
            </div>
            <div className="form-row">
              <label>Reps</label>
              <input
                type="number"
                name="reps"
                value={updatedWorkout.reps}
                onChange={handleUpdate}
                required
              />
            </div>
            <div className="form-row">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={updatedWorkout.date}
                onChange={handleUpdate}
                required
              />
            </div>
            <button type="submit">Update Workout</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ViewWorkouts;
