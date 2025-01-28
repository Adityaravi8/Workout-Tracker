### Workout Tracker App

This full-stack MERN application allows you to track your fitness journey with the following functionalities:

- **Add a New Workout:** Enter details such as the workout name, weight, number of reps, and date.
- **Delete a Workout:** Remove any existing workout from your records.
- **Update an Existing Workout:** Modify the details of a workout that’s already been added to the database.
- **View all workouts:** Table to view all the workouts you have done.

### Prerequisites

1.  Create a mongodb cluster and copy the connection string
2.  Clone this repository and create a .env file within the backend folder with the following code:
    `PORT=4000`
    `MONGO_URI="<Enter your mongodb connection string here>"`
3.  Create a .env file within the frontend folder as well with the following code:
    `REACT_APP_API_URL=<"Enter your host">`

### How to Run

After creating the env file with the corresponding details. Simply run the command below to start the application

`docker-compose up`
