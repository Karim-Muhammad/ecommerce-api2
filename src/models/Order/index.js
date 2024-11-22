const { default: mongoose } = require("mongoose");
const OrderSchema = require("./schema");

const OrderModel = mongoose.model("Order", OrderSchema);

module.exports = OrderModel;
