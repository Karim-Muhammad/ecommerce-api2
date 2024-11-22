const { model } = require("mongoose");
const CartSchema = require("./schema");

//
require("./methods");
require("./middlewares");

const CartModel = model("Cart", CartSchema);

module.exports = CartModel;
