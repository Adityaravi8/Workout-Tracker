import React, { useEffect, useState } from "react";
import axios from "axios";
import "./viewWorkouts.css";

function ViewWorkouts() {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/workoutRoutes/")
      .then((res) => setWorkouts(res.data))
      .catch((err) => console.log(err));
  }, []);

  const deleteWorkout = (id) => {
    axios
      .delete(`http://localhost:4000/api/workoutRoutes/${id}`)
      .then((res) => console.log("Successfully deleted workout"))
      .catch((err) => console.log(err));
    alert("Success");
    window.location.reload(false);
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
          {workouts.map((workouts) => (
            <tr key={workouts._id}>
              <td>{workouts.workoutTitle}</td>
              <td>{workouts.weight}</td>
              <td>{workouts.reps}</td>
              <td>{workouts.date}</td>
              <td>
                <button onClick={() => deleteWorkout(workouts._id)}>
                  Delete
                </button>
              </td>
              <td>
                <button>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewWorkouts;
