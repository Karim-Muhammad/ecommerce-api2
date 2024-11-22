const { Schema } = require("mongoose");
const { PaymentMethodType } = require("../../helpers/constants");

exports.PaymentMethodType = PaymentMethodType;

const OrderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderItems: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: Number,
        color: String,
        price: Number,
      },
    ],

    paymentMethod: {
      type: String,
      enum: [PaymentMethodType.CASH, PaymentMethodType.CREDIT_CARD],
      default: PaymentMethodType.CASH,
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: Date,

    taxPrice: {
      type: Number,
      default: 0.0,
    },

    shippingPrice: {
      type: Number,
      default: 0.0,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    isDelivered: {
      type: Boolean,
      default: false,
    },

    deliveredAt: Date,
  },
  { timestamps: true }
);

module.exports = OrderSchema;
