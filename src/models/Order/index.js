const { default: mongoose } = require("mongoose");
const OrderSchema = require("./schema");

require("./middlewares");

const OrderModel = mongoose.model("Order", OrderSchema);

module.exports = OrderModel;
