const Coupon = require("../models/Coupon");

const {
  deleteOne,
  getOne,
  getAll,
  createOne,
  updateOne,
} = require("../utils/CRUDController");

/**
 * @description Create a new coupon
 * @route POST /api/v1/coupons
 * @access Private/Admin/Manager
 * @request_body { name: "Coupon Name" }
 */
exports.createCoupon = createOne(Coupon);

/**
 * @description Get all coupons
 * @route GET /api/v1/coupons
 * @access Private/Admin/Manager
 * @request_body {
    "name": "new year",
    "discountType": "percentage",
    "discount": 50,
    "expire": "2024-10-29T10:24"
    }
 * @query { page: 1, limit: 2 }
 * @response { page: 1, length: 2, data: [ { coupon1 }, { coupon3 } ] }
 */
exports.getCoupons = getAll(Coupon);

/**
 * @description Get single Coupon
 * @route GET /api/v1/coupons/:id
 * @access Private/Admin/Manager
 * @request_body { }
 * @param { id } - Coupon ID
 * @response { data: { coupon } }
 * @error { 404: "Coupon with id ${couponId} not found" }
 */
exports.getCoupon = getOne(Coupon);

/**
 * @description Update single Coupon
 * @route PUT /api/v1/coupons/:id
 * @access Private/Admin/Manager
 * @param { id } - Coupon ID
 * @response { data: { coupon } }
 * @error { 404: "Coupon with id ${couponId} not found" }
 */
exports.updateCoupon = updateOne(Coupon);

/**
 * @description Delele single Coupon
 * @route DELETE /api/v1/coupons/:id
 * @access Private/Admin/Manager
 * @request_body { }
 * @param { id } - Coupon ID
 * @response { data: null }
 * @error { 404: "Coupon with id ${couponId} not found" }
 */
exports.deleteCoupon = deleteOne(Coupon);
