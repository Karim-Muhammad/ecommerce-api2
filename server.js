// Deps
const express = require("express");

const cors = require("cors");

const qs = require("qs");

const morgan = require("morgan");

// load env variables `node v21.0.0` or higher by using loadEnv function in core node module
require("dotenv").config();

// Configuration file
const config = require("./config");

// Set up Database
const setupConnection = require("./src/utils/setup-connection-db");

const bootRoutes = require("./src/routes/apps");

const globalErrorHandler = require("./src/middlewares/errorMiddleware");
const { webhookCheckout } = require("./src/controllers/OrderController");

setupConnection();

// Express app
const app = express();
app.use(cors()); // Enable All CORS Requests (for all routes)
app.options("*", cors()); // Enable Pre-Flight Request (for all routes)

app.use(require("compression")());

app.set("query parser", (str) => qs.parse(str));

// Configurations
// app.use("json spaces", 2);
app.use(express.static(`${__dirname}/storage`));

// Webhook
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

// Parse Body of JSON request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (config.node_env === "development") app.use(morgan("dev"));
else app.use(morgan("combined"));

// Bootstrap Mini Apps
bootRoutes(app);

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
