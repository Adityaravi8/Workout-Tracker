const express = require("express");
const mongoose = require("mongoose");
const workoutRoutes = require("./routes/workoutRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(console.log("Successfully connected to db"));

app.use("/api/workoutRoutes", workoutRoutes);

app.listen(process.env.PORT, () => {
  console.log("Connected to port: ", process.env.PORT);
});
