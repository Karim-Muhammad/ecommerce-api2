const { validationResult } = require("express-validator");
const ApiError = require("../utils/ApiError");

exports.doValidate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // console.log(errors.array());

    return next(new ApiError(400, errors.array()));
  }

  next();
};

// we can use `joi` instead, it is more powerful and flexible