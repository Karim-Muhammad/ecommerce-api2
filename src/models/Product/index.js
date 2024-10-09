const mongoose = require("mongoose");
const ProductSchema = require("./schema");

require("./virtuals");
require("./middlewares");

module.exports = mongoose.model("Product", ProductSchema);
