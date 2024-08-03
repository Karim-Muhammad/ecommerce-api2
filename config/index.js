module.exports = {
  home: process.env.HOME || "../",
  // SERVER
  base_url: process.env.BASE_URL || "http://localhost:8000",
  port: process.env.PORT || 8000,
  node_env: process.env.NODE_ENV || "development",
  // DATABASE
  atlas_uri: process.env.CONNECTION_STRING,
  // JWT
  secret_key: process.env.SECRET_KEY,
  // EMAIL
  email_host: process.env.MAIL_HOST,
  email_port: process.env.MAIL_PORT,
  email_secure: process.env.MAIL_SECURE,
  email_user: process.env.MAIL_USER,
  email_pass: process.env.MAIL_PASSWORD,
};
