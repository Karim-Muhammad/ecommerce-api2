const { model } = require("mongoose");
const CouponSchema = require("./schema");

require("./hooks");

const CouponModel = model("Coupon", CouponSchema);
//

module.exports = CouponModel;
