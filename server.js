// Deps
const express = require("express");
const morgan = require("morgan");
require("dotenv").config();

// Configuration file
const config = require("./config");

// Set up Database
const setupConnection = require("./src/utils/setup-connection-db");
const ApiError = require("./src/utils/ApiError");
const globalErrorHandler = require("./src/middlewares/errorMiddleware");
setupConnection();

// Express app
const app = express();

// Parse Body of JSON request
app.use(express.json());

if (config.node_env === "development") app.use(morgan("dev"));

// Mini Apps
app.use("/api/v1/categories", require("./src/routes/category")); // Categories

// 404 Handler
app.all("*", (req, res, next) => {
  res.status(404).json(ApiError.notFound("Page Not Found!"));
  // next(ApiError.notFound("Page Not Found!"));
});

// Global Error Handler
app.use(globalErrorHandler);

// Server Listening to port
app.listen(config.port, () => {
  console.log("App is running on port 8000");
});
