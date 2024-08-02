const { body } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const ApiError = require("../../utils/ApiError");
const { doValidate } = require("../../validators");

exports.createUserRule = [
  body("username")
    .notEmpty()
    .withMessage("Username is required.")
    .isLength({
      min: 3,
    })
    .withMessage("Username must has at least 3 characters.")
    .custom(async (username, { req }) => {
      // Check The uniquenest of username
      const user = await User.findOne({ username });
      if (user) throw ApiError.badRequest("Username is already be taken!");

      return true;
    }),

  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Email is invalid.")
    .custom(async (email, { req }) => {
      // Check The Unqiueness of Email
      const user = await User.findOne({ email });
      if (user) throw ApiError.badRequest("Email is already be taken!");

      return true;
    }),

  body("password")
    .notEmpty()
    .withMessage("Password Must be filled!")
    .isLength({ min: 7 })
    .withMessage("Password must has at least 7 characters."),

  body("password-confirmation")
    .notEmpty()
    .withMessage("Password Confirmation is required.")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw ApiError.badRequest("Password is not matched.");
      }

      return true;
    }),

  body("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("EG/SA Phone numbers is Allowed."),

  body("role").optional().isIn(["user", "admin"]).withMessage("Invalid Role."),

  body("profileImage")
    .optional()
    .isString()
    .withMessage("profileImage should be string!"),

  doValidate,
];

exports.updateUserRule = [
  body("username")
    .optional()
    .isLength({
      min: 3,
    })
    .withMessage("Username must has at least 3 characters.")
    .custom(async (username, { req }) => {
      // Check The uniquenest of username
      const user = await User.findOne({ username });
      if (user) throw ApiError.badRequest("Username is already be taken!");

      return true;
    }),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Email is invalid.")
    .custom(async (email, { req }) => {
      // Check The Unqiueness of Email
      const user = await User.findOne({ email });
      if (user) throw ApiError.badRequest("Email is already be taken!");

      return true;
    }),

  body("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("EG/SA Phone numbers is Allowed."),

  body("role").optional().isIn(["user", "admin"]).withMessage("Invalid Role."),

  body("profileImage")
    .optional()
    .isString()
    .withMessage("profileImage should be string!"),

  doValidate,
];

exports.changePasswordRule = [
  body("current-password")
    .notEmpty()
    .withMessage("Password Must be filled!")
    .custom(async (value, { req }) => {
      req.user = await User.findById(req.params.id).select("+password");

      const isEqual = await bcrypt.compare(value, req.user.password);
      if (!isEqual) {
        throw ApiError.badRequest("Password is not matched.");
      }

      return true;
    }),

  body("new-password")
    .notEmpty()
    .withMessage("Password Must be filled!")
    .isLength({ min: 7 })
    .withMessage("Password must has at least 7 characters."),

  body("new-password-confirmation")
    .notEmpty()
    .withMessage("Password Confirmation is required.")
    .custom((value, { req }) => {
      if (value !== req.body["new-password"]) {
        throw ApiError.badRequest("Password is not matched.");
      }

      return true;
    }),

  doValidate,
];
