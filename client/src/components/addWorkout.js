import React, { useState } from "react";
import axios from "axios";
import "./addWorkout.css";

function AddWorkout() {
  // Variables for setting the various details of the workouts
  const [workoutTitle, setworkoutTitle] = useState("");
  const [weight, setWeight] = useState([]);
  const [reps, setReps] = useState([]);
  const [date, setDate] = useState([]);

  // Function to post a new workout into the database
  const postData = (e) => {
    e.preventDefault();
    axios
      .post(`${process.env.REACT_APP_API_URL}/api/workoutRoutes/`, {
        workoutTitle: workoutTitle,
        reps: reps,
        weight: weight,
        date: date,
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    alert("Success");
    window.location.reload(false);
  };

  return (
    // Form for the user to enter the workout details to send to the database
    <div>
      <div>
        <form className="form-field" onSubmit={(e) => e.preventDefault()}>
          <div className="form-row">
            <label>Workout Name</label>
            <input
              placeholder="Enter Workout Name"
              value={workoutTitle}
              onChange={(e) => setworkoutTitle(e.target.value)}
            />
          </div>
          <br />
          <div className="form-row">
            <label>Enter Weight</label>
            <input
              placeholder="Enter Weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
          <br />
          <div className="form-row">
            <label>Enter # of Reps</label>
            <input
              placeholder="Enter Reps"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
            />
          </div>
          <br />
          <div className="form-row">
            <label>Enter Date</label>
            <input
              placeholder="Enter Reps"
              value={date}
              type="date"
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <br />
          <button onClick={postData}>Submit</button>
        </form>
      </div>
    </div>
  );
}

export default AddWorkout;
