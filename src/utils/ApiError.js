/**
 * @class ApiError
 * @description Custom error class to handle API errors (operational errors - errors that are expected)
 * @extends Error
 * @param {number} statusCode - HTTP Status Code
 * @param {object|array} error - Error message
 * @param {boolean} isOperational - Is the error operational (expected) or not
 */
class ApiError extends Error {
  constructor(statusCode, error, isOperational = true) {
    console.log("ERROR: ", error);
    super(error?.message || error?.msg || "An error occurred!");
    this.bag = error;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
  }

  static badRequest(message = "Bad Request") {
    return new ApiError(400, { message });
  }

  static notFound(message = "Not Found") {
    return new ApiError(404, { message });
  }

  static inServer(message = "Internal Server Error") {
    return new ApiError(500, { message });
  }

  static forbidden(message = "Forbidden") {
    return new ApiError(403, { message });
  }

  static unauthorized(message = "Unauthorized") {
    return new ApiError(401, { message });
  }

  toJson() {
    return {
      errorBag: this.error,
      stack: this.stack,
      message: this.message,
      statusCode: this.statusCode,
      isOperational: this.isOperational,
    };
  }

  toString() {
    return this.toJson();
  }
}

module.exports = ApiError;
