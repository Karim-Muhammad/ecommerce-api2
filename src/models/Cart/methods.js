const CartSchema = require("./schema");

CartSchema.methods.saveIO = async function () {
  await this.save();
};

CartSchema.methods.reset = async function () {
  this.cartItems = [];
  this.totalPriceAfterDiscount = undefined;
  await this.save();
};

// CartSchema.methods.removeItem = async function (itemId, quantity) {}
