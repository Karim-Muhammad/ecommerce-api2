const { Schema } = require("mongoose");

const AppSettingsSchema = new Schema({
  taxPrice: {
    type: Number,
    default: 0,
  },

  shippingPrice: {
    type: Number,
    default: 10, // 10 USD
  },

  freeShippingMinimumOrderAmount: {
    type: Number,
    default: 10, // if the order amount is greater than 10, then shipping is free
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = AppSettingsSchema;
