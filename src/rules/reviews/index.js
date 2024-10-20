const validate = require("express-validator");
const Product = require("../../models/Product");
const { doValidate } = require("../../validators");
const Review = require("../../models/Reviews");

exports.createReviewRule = [
  validate.body("text").optional().isString(),

  validate
    .body("rating")
    .notEmpty()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  validate
    .body("user")
    .notEmpty()
    .isMongoId()
    .withMessage("User ID is required")
    .custom(async (userId, { req }) => {
      if (userId !== req.user.id) {
        throw new Error("User ID must be the same as the logged in user.");
      }

      return true;
    }),

  validate
    .body("product")
    .notEmpty()
    .isMongoId()
    .withMessage("Product ID is required")
    .custom(async (value, { req }) => {
      // 1. Check if product exists
      const product = await Product.findById(value);
      if (!product) throw new Error("Product not found.");

      // 2. Check if user has already reviewed this product
      const review = await Review.findOne({
        user: req.user.id,
        product: value,
      });
      if (review) throw new Error("User has already reviewed this product.");

      return true;
    }),

  doValidate,
];

exports.updateReviewRule = [
  validate
    .param("id")
    .isMongoId()
    .withMessage("Review ID is required")
    .custom(async (reviewId, { req }) => {
      console.log("User ID", req.user);
      const userWithThisReview = await Review.findOne({ _id: reviewId });
      // 1. Check if review exist
      if (!userWithThisReview) {
        throw new Error("Review not found.");
      }

      // 2. Check if user is allowed to update this review
      if (userWithThisReview.user._id.toString() !== req.user.id) {
        throw new Error("You're not allowed to update this review.");
      }

      return true;
    }),

  validate.body("text").optional().isString(),
  validate
    .body("rating")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  validate
    .body("user")
    .optional()
    .isMongoId()
    .withMessage("User ID is required")
    .custom(async (value, { req }) => {
      if (value !== req.user.id) {
        throw new Error("User ID must be the same as the logged in user.");
      }

      return true;
    }),

  validate
    .body("product")
    .optional()
    .isMongoId()
    .withMessage("Product ID is required")
    .custom(async (value, { req }) => {
      const product = await Product.findById(value);
      if (!product) {
        throw new Error("Product not found.");
      }

      return true;
    }),

  doValidate,
];

exports.deleteReviewRule = [
  validate
    .param("id")
    .isMongoId()
    .withMessage("Review ID is required")
    .custom(async (reviewId, { req }) => {
      const userWithThisReview = await Review.findOne({ _id: reviewId });
      // 1. Check if review exist
      if (!userWithThisReview) {
        throw new Error("Review not found.");
      }

      // 2. Check if user is allowed to update this review
      if (
        userWithThisReview.user._id.toString() !== req.user.id &&
        req.user.role === "user"
      ) {
        throw new Error("You're not allowed to update this review.");
      }

      return true;
    }),

  doValidate,
];
