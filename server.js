// Deps
const express = require("express");

const qs = require("qs");

const morgan = require("morgan");

require("dotenv").config();
// load env variables `node v21.0.0` or higher by using loadEnv function in core node module

// Configuration file
const config = require("./config");

// Set up Database
const setupConnection = require("./src/utils/setup-connection-db");

const ApiError = require("./src/utils/ApiError");
const bootRoutes = require("./src/routes/apps");

const globalErrorHandler = require("./src/middlewares/errorMiddleware");

setupConnection();

// Express app
const app = express();
app.set("query parser", (str) => qs.parse(str));

// Configurations
// app.use("json spaces", 2);
app.use(express.static(`${__dirname}/storage`));

// Parse Body of JSON request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (config.node_env === "development") app.use(morgan("dev"));

// Bootstrap Mini Apps
bootRoutes(app);

// 404 Handler
app.all("*", (req, res, next) => {
  res.status(404).json({
    error: ApiError.notFound("Page Not Found!"),
  });
  // next(ApiError.notFound("Page Not Found!"));
});

// 0) Global Error Handler (Express)
app.use(globalErrorHandler);

// Server Listening to port
const server = app.listen(config.port, () => {
  console.log("App is running on port 8000");
});

// 1) Unhandled Rejection
// This is for handling unhandled promise rejection

process.on("unhandledRejection", (err) => {
  console.error("Uncaught Rejection! Shutting down...");
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});

// 2) Uncaught Exception
// This is for handling uncaught exception
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception! Shutting down...");
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});
