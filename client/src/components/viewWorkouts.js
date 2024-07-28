import React, { useEffect, useState } from "react";
import axios from "axios";

function ViewWorkouts() {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/workoutRoutes/")
      .then((res) => setWorkouts(res.data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <div>
      <table>
        <thead>
          <tr>
            <td>Workout Name</td>
            <td>Weight</td>
            <td>Reps</td>
            <td>Date</td>
          </tr>
        </thead>
        {workouts.map((workouts) => (
          <tr>
            <td>{workouts.workoutTitle}</td>
            <td>{workouts.weight}</td>
            <td>{workouts.reps}</td>
            <td>{workouts.date}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}

export default ViewWorkouts;
