const UserSchema = require("./schema");

UserSchema.virtual("isAdmin").get(function () {
  return this.role === "admin";
});
