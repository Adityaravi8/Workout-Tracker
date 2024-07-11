const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});
mongoose
  .connect(process.env.MONGO_URI)
  .then(console.log("Successfully connected to db"));

app.listen(process.env.PORT, () => {
  console.log("Connected to port: ", process.env.PORT);
});
