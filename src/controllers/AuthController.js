const jwt = require("jsonwebtoken");

const ApiError = require("../utils/ApiError");

const config = require("../../config");

const User = require("../models/User");
const { createToken } = require("../helpers");

/**
 * @class AuthController
 * @description This class contains all the methods required to handle the authentication
 * of the user
 */
class AuthController {
  /**
   * @description This method is used to register a new user
   */
  signup() {
    return function (req, res, next) {
      const user = new User(req.body);
      let token;

      try {
        user.save();
        token = createToken({ id: user._id, role: user.role });
      } catch (error) {
        return next(ApiError.badRequest(error.message));
      }

      res.status(201).json({
        message: "User created successfully",
        user,
        token,
      });
    };
  }

  /**
   * @description This method is used to login a user
   */
  signin() {
    return function (req, res, next) {
      const { user } = req;
      const token = createToken({ id: user._id, role: user.role });
      return res.status(200).json({
        token: token,
      });
    };
  }

  /**
   * @description This method is used to get the details of the logged in user
   * @returns
   */
  me() {
    return function (req, res, next) {
      const { user } = req;
      return res.status(200).json({
        user,
      });
    };
  }

  /**
   * @description This method is used to logout a user
   */
  signout() {
    return function (req, res, next) {};
  }

  /**
   * @description This method is used to get the ask for a password reset
   */
  forgotPassword() {
    return function (req, res, next) {};
  }

  /**
   * @description This method is used to reset the password (only for UN-Authenticated users)
   */
  resetPassword() {
    return function (req, res, next) {};
  }

  /**
   * @description This method is used to change the password (only for Authenticated users)
   */
  changePassword() {
    return function (req, res, next) {};
  }

  /**
   * @description This method is used to verify the email
   */
  verifyEmail() {
    return function (req, res, next) {};
  }

  /**
   * @description This method is used to resend the email verification
   */
  resendEmailVerification() {
    return function (req, res, next) {};
  }
}

exports.AuthController = new AuthController();
