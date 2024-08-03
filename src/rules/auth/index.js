const { body } = require("express-validator");

const bcrypt = require("bcryptjs");

const ApiError = require("../../utils/ApiError");

const { doValidate } = require("../../validators");

const User = require("../../models/User");

exports.signUpUserRule = [
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

  doValidate,
];

exports.signInUserRule = [
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Email is invalid.")
    .custom(async (email, { req }) => {
      // Check The Unqiueness of Email
      const user = await User.findOne({ email }).select("+password");
      if (!user) throw ApiError.badRequest("Cerdentials are invalid!");

      req.user = user;
      return true;
    }),

  body("password")
    .notEmpty()
    .withMessage("Password Must be filled!")
    .isLength({ min: 7 })
    .withMessage("Password must has at least 7 characters.")
    .custom(async (value, { req }) => {
      const { user } = req;

      if (!(await bcrypt.compare(value, user.password)))
        throw ApiError.badRequest("Credentials are invalid!");

      return true;
    }),
  doValidate,
];

exports.forgotPasswordRule = [
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Email is invalid."),
  doValidate,
];

exports.verifyPasswordResetCodeRule = [
  body("resetCode")
    .notEmpty()
    .withMessage("Reset Code is required.")
    .isLength({
      min: 6,
      max: 6,
    })
    .withMessage("Please enter a valid reset code."),

  doValidate,
];

exports.resetPasswordRule = [
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Email is invalid!"),

  body("password")
    .notEmpty()
    .withMessage("Password is required!")
    .isLength({ min: 7 })
    .withMessage("Password must has at least 7 characters."),

  body("passwordConfirmation")
    .notEmpty()
    .withMessage("Password Confirmation is required.")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw ApiError.badRequest("Password is not matched.");
      }

      return true;
    }),

  doValidate,
];

exports.changePasswordRule = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current Password is required!")
    .custom(async (value, { req }) => {
      const { user } = req;

      if (!(await bcrypt.compare(value, user.password)))
        throw ApiError.badRequest("Current Password is Invalid!");

      return true;
    }),

  body("newPassword")
    .notEmpty()
    .withMessage("New Password is required!")
    .isLength({ min: 7 })
    .withMessage("Password must has at least 7 characters."),

  body("newPasswordConfirmation")
    .notEmpty()
    .withMessage("Password Confirmation is required.")
    .custom((value, { req }) => {
      console.log(value, req.body, value === req.body.newPassword);
      if (value !== req.body.newPassword) {
        throw ApiError.badRequest("Password is not matched.");
      }

      return true;
    }),

  doValidate,
];
