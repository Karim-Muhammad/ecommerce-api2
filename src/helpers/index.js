const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const config = require("../../config");

/**
 * @description Middleware to log the request body
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.dump = function (req, res, next) {
  console.log("Request Body: ", req.body);

  next();
};

/**
 * @description Preventing the user from sending the password field in the request
 * @param {*} fields
 * @returns
 */
exports.excludeFromBody = function (fields) {
  return function (req, res, next) {
    fields.forEach((field) => {
      delete req.body[field];
    });

    next();
  };
};

/**
 * @description Preventing the user from sending the password field in the request for update
 */
exports.preventPasswordUpdate = function (req, res, next) {
  if (req.body.password) {
    throw ApiError.badRequest(
      "Password cannot be updated here. (Use /change-password)"
    );
  }

  next();
};

exports.createToken = function (userPayload) {
  return jwt.sign(userPayload, config.secret_key, {
    expiresIn: "2h",
  });
};

exports.verifyToken = function (token) {
  return jwt.verify(token, config.secret_key);
};
