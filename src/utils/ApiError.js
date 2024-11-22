function getMessages(error) {
  if (Array.isArray(error)) {
    let count = error.length;

    return error.reduce((res, err) => {
      const separator = count > 1 ? ", " : "";
      const message = err.message ?? err.msg ?? "an error occured!";

      count -= 1;

      return `${res + message.concat(separator)}`;
    }, "");
  }

  return error.message || error.msg || "An error occurred!";
}

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
    super(getMessages(error)); // getMessages is a helper function

    // --------------------------
    this.bag = error;
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
    // create a stack property on the object that represents the point in the code at which the Error was instantiated.
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

  /**
   * @description Check if the user is not authenticated
   * @param {*} message
   * @returns
   */
  static unauthenticated(message = "Unauthenticated") {
    return new ApiError(401, { message });
  }

  /**
   * @description Check if the user is not authorized to access the resource
   * @param {*} message
   * @returns
   */
  static unauthorized(message = "Unauthorized") {
    return new ApiError(403, { message });
  }

  /**
   * @description Check if token is expired -> TokenExpiredError
   * @param {*} message
   * @returns
   */
  static webTokenExpired(message = "Web Token Expired") {
    return new ApiError(401, { message });
  }

  /** [read](https://www.npmjs.com/package/jsonwebtoken#jsonwebtokenerror)
   * @description Check if token is invalid (manipulated, changed, signture changed)
   * wrong secret, wrong algorithm, etc -> JsonWebTokenError
   * @returns
   */
  static webTokenInvalid(message = "Web Token Invalid") {
    return new ApiError(401, { message });
  }

  static catchWebTokenError(error) {
    if (error.name === "TokenExpiredError") return ApiError.webTokenExpired();
    if (error.name === "JsonWebTokenError") return ApiError.webTokenInvalid();
    return ApiError.unauthorized(error.message);
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
