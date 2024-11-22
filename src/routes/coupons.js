const { Router } = require("express");
const {
  getCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/CouponController");
const {
  guarding,
  restrictTo,
} = require("../middlewares/authenticationMiddlewares");
const {
  ensureIdMongoIdRule,
  isIdMongoIdExistsRule,
} = require("../rules/shared");
const CouponModel = require("../models/Coupon");

const router = Router();

router.use(guarding(), restrictTo("admin", "manager", "vendor"));

router.route("/").get(getCoupons).post(createCoupon);
router
  .route("/:id")
  .all(ensureIdMongoIdRule(CouponModel), isIdMongoIdExistsRule(CouponModel))
  .get(getCoupon)
  .patch(updateCoupon)
  .delete(deleteCoupon);

module.exports = router;
