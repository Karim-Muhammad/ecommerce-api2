const mongoose = require("mongoose");
const UserSchema = require("./schema");

require("./methods");
require("./middleware");

const User = mongoose.model("User", UserSchema);

module.exports = User;
