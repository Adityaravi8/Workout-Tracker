import React from "react";
import AddWorkout from "./components/addWorkout";
import ViewWorkouts from "./components/viewWorkouts";
import "./App.css";

function App() {
  return (
    <div className="App">
      <AddWorkout />
      <ViewWorkouts />
    </div>
  );
}

export default App;
