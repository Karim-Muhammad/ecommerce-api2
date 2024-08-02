module.exports = {
  base_url: process.env.BASE_URL || "http://localhost:8000",
  port: process.env.PORT || 8000,
  node_env: process.env.NODE_ENV || "development",
  atlas_uri: process.env.CONNECTION_STRING,
  home: process.env.HOME || "../",

  secret_key: process.env.SECRET_KEY,
};
