const { verifyToken } = require("../helpers");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");

/**
 * @description Middleware that checks if the user is logged in
 * @returns
 */
exports.guarding = function () {
  return async function (req, res, next) {
    console.log(req.headers.authorization);

    // 1) Check if token exist
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer")
    ) {
      return next(ApiError.unauthenticated("Un-Authenticated Access!"));
    }

    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return next(ApiError.unauthenticated("Un-Authenticated Access!"));
    }

    // 2) Verify Token (Check if token is valid - no changes or expired)
    try {
      const payload = verifyToken(token);

      // 3) May admin remove this user which is currently loggin in
      // so even if token is valid and exist, user which belong may no longer exist!
      const user = await User.findById(payload.id);
      console.log("[Verified Token]", payload, user);

      if (!user) {
        return next(
          ApiError.unauthenticated("Un-Authenticated Access! (User not found)")
        );
      }

      // 4) Check if user changed Password after token was issued(generated)
      const passwordChangedAtInSec = parseInt(
        user.passwordChangedAt / 1000,
        10
      );

      console.log("[Check]", passwordChangedAtInSec, payload.iat);

      if (passwordChangedAtInSec > payload.iat) {
        return next(
          ApiError.unauthenticated(
            "Un-Authenticated Access! (User changed password after token was issued)"
          )
        );
      }

      req.user = user;
    } catch (error) {
      console.dir(error);
      throw ApiError.catchWebTokenError(error);
    }

    next();
  };
};

/**
 * @description Middleware that checks if the user is an admin
 * @returns
 */
exports.guardingAdmin = function () {
  // Return a function that first calls the guarding middleware
  return async function (req, res, next) {
    // Call the guarding middleware first
    await exports.guarding()(req, res, async (err) => {
      if (err) return next(err);

      // Now proceed with the admin-specific checks
      if (!req.user || req.user.role !== "admin") {
        return next(ApiError.unauthorized("Unauthorized Access! (Admin only)"));
      }

      // If the user is an admin, continue to the next middleware
      next();
    });
  };
};

/**
 * @description Middleware that check if the user is not logged in
 * @returns
 */
exports.reverseGuarding = function () {
  return function (req, res, next) {
    if (req.headers.authorization) {
      return next(
        ApiError.unauthenticated("Authenticated Access! (Already Logged in)")
      );
    }

    next();
  };
};

/**
 * @description Middleware that checks if the user is an specific role
 * @param  {...any} roles
 * @returns
 */
exports.restrictTo = function (...roles) {
  return async function (req, res, next) {
    await exports.guarding()(req, res, (err) => {
      if (err) return next(err);

      if (!roles.includes(req.user.role)) {
        return next(
          ApiError.unauthorized("Unauthorized Access (Permission denied)!")
        );
      }

      next();
    });
  };
};
