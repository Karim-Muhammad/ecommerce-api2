module.exports = {
  port: process.env.PORT || 8000,
  node_env: process.env.NODE_ENV || "development",
  atlas_uri: process.env.CONNECTION_STRING,
  home: process.env.HOME || "../",
};
