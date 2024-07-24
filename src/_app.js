// Deps
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
require("dotenv").config();

// Configuration file
const config = require("../config");

// Connect to database
mongoose
  .connect(config.atlas_uri)
  .then((connection) => {
    console.log("Connected Successfully! ", connection.connection.host);
  })
  .catch((error) => {
    console.log("Database Error ", error);
    process.exit(1);
  });

//   Create Schema
const CategorySchema = new mongoose.Schema({
  name: String,
});

const CategoryModel = mongoose.model("Category", CategorySchema);

// Express app
const app = express();

// Parse Body of JSON request
app.use(express.json());

if (config.node_env === "development") app.use(morgan("dev"));

app.post("/", (req, res, next) => {
  const { name } = req.body;
  const newCategory = new CategoryModel({ name });
  newCategory
    .save()
    .then((doc) => {
      res.json(doc);
    })
    .catch((er) => {
      res.json(er);
    });
});

// Server Listening to port
app.listen(config.port, () => {
  console.log("App is running on port 8000");
});
