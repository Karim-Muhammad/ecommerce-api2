const { Schema } = require("mongoose");

const DiscountType = {
  PERCENTAGE: "percentage",
  CASH: "cash",
};

exports.DiscountType = DiscountType;

const CouponSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Coupon name must be filled!"],
    },

    expire: {
      type: Date,
      required: [true, "Coupon Expiration must be filled!"],
    },

    discountType: {
      type: String,
      enum: [DiscountType.PERCENTAGE, DiscountType.CASH],
      optional: true,
      default: DiscountType.PERCENTAGE,
    },

    discount: {
      type: Number,
      required: [true, "Coupon discount must be filled!"],
    },
  },
  { timestamps: true }
);

module.exports = CouponSchema;
