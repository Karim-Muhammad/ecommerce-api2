const ApiError = require("./ApiError");

module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch((error) =>
    next(error instanceof ApiError ? error : new ApiError(500, error, false))
  );
};
