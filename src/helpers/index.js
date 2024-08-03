const crypto = require("crypto");
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

/**
 * @description function to create a token with the user payload
 * @param {*} userPayload
 * @returns
 */
exports.createToken = function (userPayload) {
  return jwt.sign(userPayload, config.secret_key, {
    expiresIn: "2h",
  });
};

/**
 * @description function to extract the payload from the token
 * @param {*} token
 * @returns
 */
exports.verifyToken = function (token) {
  return jwt.verify(token, config.secret_key);
};

/**
 * @description generate a random code of a given number of digits
 * @param {*} numberOfDigits
 * @returns
 */
exports.generateRandomCode = (numberOfDigits) =>
  Math.floor(
    10 ** (numberOfDigits - 1) + Math.random() * 10 ** (numberOfDigits - 1)
  ).toString();

/**
 * @description hash a text once, `crypto` hash same text multiple times will return same hash all the time
 * @param {*} text
 * @returns
 */
exports.hashOnce = (text) =>
  crypto.createHash("sha256").update(text).digest("hex");
