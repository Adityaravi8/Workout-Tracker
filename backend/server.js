const express = require("express");
const mongoose = require("mongoose");
const workoutRoutes = require("./routes/workoutRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Connecting to database
mongoose
  .connect(process.env.MONGO_URI)
  .then(console.log("Successfully connected to db"));

// Register routes
app.use("/api/workoutRoutes", workoutRoutes);

// Listening for the port
app.listen(process.env.PORT, () => {
  console.log("Connected to port: ", process.env.PORT);
});
