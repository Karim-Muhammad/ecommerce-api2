// Deps
const express = require("express");
require("dotenv").config();

// Configuration file
const config = require("./config");

// Express app
const app = express();

app.get("/", (req, res, next) => {
  res.send("Hello World");
});

// Server Listening to port
app.listen(config.port, () => {
  console.log("App is running on port 8000");
});
