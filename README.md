### Workout Tracker App

This full-stack MERN application allows you to track your fitness journey with the following functionalities:

- **Add a New Workout:** Enter details such as the workout name, weight, number of reps, and date.
- **Delete a Workout:** Remove any existing workout from your records.
- **Update an Existing Workout:** Modify the details of a workout that’s already been added to the database.
- **View all workouts:** Table to view all the workouts you have done.

### Prerequisites:

### 1. Create a mongodb database and get the Mongodb connection string.

### 2. Clone this repository and create a .env file within the backend folder

### 3. Within the .env file create the two variables below with the port and the mongodb connection string that you get upon creating a database.

`PORT=4000`
`MONGO_URI=<mongodb connection string>`

### 4. Use the following commands to run the app:

- Step 1: change into backend directory using `cd backend` then run `npm install`
- Step 2: Run the api by using `npm run dev`
- Step 3: Create a new terminal and change into the client directory using `cd client` then run `npm install`
- Step 4: Finally run the frontend using `npm start`
