// Deps
const express = require("express");

const cors = require("cors");

const rateLimiter = require("express-rate-limit");

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

// 2# Security HTTP Headers - Rate Limiting
const limiter = rateLimiter({
  max: 100,
  windowMs: 10 * 60 * 1000, // 10 minutes
  message: "Too many requests from this IP, please try again in 10 minutes!",
});
app.use("/api/", limiter);
// Enable All CORS Requests (for all routes)
app.use(cors());
// Enable Pre-Flight Request (for all routes)
app.options("*", cors());

// Compress all responses (for all routes)
app.use(require("compression")());

// Query Parser
app.set("query parser", (str) => qs.parse(str));

// Configurations
// app.use("json spaces", 2);
app.use(express.static(`${__dirname}/storage`));
// Parse Body of JSON request
app.use((req, res, next) => {
  if (req.originalUrl === "/webhook-checkout") {
    next();
  } else {
    express.json({ limit: "20kb" })(req, res, next); // Body limit is 20kb 1# security
  }
});

// Security 4# HTTP Parameter Pollution
// express by default if you send the same query parameter/field in body twice or more, express put them all in an array
// so your app may wasn't expecting that, as well as it may be a security issue
// so we can use hpp to prevent this - hpp will use the last query/field if it is duplicated
app.use(require("hpp")()); // should bd used after body parser
// Video : https://www.indexacademy.dev/courses/1957671/lectures/44400024

// Webhook
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

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
