import React from "react";

function Navbar() {
  return (
    <div className="bg-teal-500">
      <div className="flex flex-row text-center p-6 justify-center gap-44 text-3xl  items-center">
        <a
          href="#Workouts"
          className="hover:underline underline-offset-8 decoration-4"
        >
          Add A Workout
        </a>
        <a
          href="#viewWorkouts"
          className="hover:underline underline-offset-8 decoration-4"
        >
          View Workouts
        </a>
      </div>
    </div>
  );
}

export default Navbar;
