const CouponSchema = require("./schema");

CouponSchema.pre("save", async function (next) {
  this.name = this.name.split(" ").join("-").toUpperCase();
  next();
});
