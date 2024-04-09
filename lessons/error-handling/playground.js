const fs = require("fs");

/**
 * 1# Example
 */

/*
fs.readFile("file.txt", (err, data) => {
  if (err) {
    // console.error(err); will not trigger uncaughtException event
    throw new Error(err); // will trigger uncaughtException event
  }
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception! Shutting down...");
  process.exit(1);
});
*/

/**
 * 2# Example
 */

/*
new Promise((resolve, reject) => {
  fs.readFile("file.txt", (err, data) => {
    if (err) {
      reject(err); // will not trigger uncaughtException event
      //   but it will trigger unhandledRejection event
    }
  });
});

// if you used `catch` method, it won't trigger any handling Exception by process

// process.on("uncaughtException", (err) => {
//   console.error(err.stack);
//   process.exit(1);
// });

process.on("unhandledRejection", (err) => {
  console.error("Uncaught Rejection! Shutting down...");
  process.exit(1);
});
*/
