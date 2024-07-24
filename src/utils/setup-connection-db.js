const mongoose = require("mongoose");
const config = require("../../config");

module.exports = async function setupConnection() {
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
};
