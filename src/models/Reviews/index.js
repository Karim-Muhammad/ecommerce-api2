const { default: mongoose } = require("mongoose");

const Review = require("./schema");
require("./statics");
require("./middlewares");

module.exports = mongoose.model("Review", Review);
