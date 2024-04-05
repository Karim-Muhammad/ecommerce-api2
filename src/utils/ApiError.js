/**
 * @class ApiError
 * @description Custom error class to handle API errors (operational errors - errors that are expected)
 * @extends Error
 * @param {number} statusCode - HTTP Status Code
 * @param {string} message - Error message
 * @param {boolean} isOperational - Is the error operational (expected) or not
 */
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
  }

  static badRequest(message = "Bad Request") {
    return new ApiError(400, message).toJson();
  }

  static notFound(message = "Not Found") {
    return new ApiError(404, message).toJson();
  }

  static inServer(message = "Internal Server Error") {
    return new ApiError(500, message).toJson();
  }

  static forbidden(message = "Forbidden") {
    return new ApiError(403, message).toJson();
  }

  static unauthorized(message = "Unauthorized") {
    return new ApiError(401, message).toJson();
  }

  toJson() {
    return {
      statusCode: this.statusCode,
      message: this.message,
      isOperational: this.isOperational,
      stack: this.stack,
    };
  }

  toString() {
    return this.toJson();
  }
}

module.exports = ApiError;
