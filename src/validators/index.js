const { validationResult } = require("express-validator");
const ApiError = require("../utils/ApiError");

exports.doValidate = (req, res, next) => {
  console.log("~~~~~~~~~~~~~~~~~~~~ doValidate ~~~~~~~~~~~~~~~~~~~~");
  const errors = validationResult(req).formatWith(({ msg, path }) => ({
    field: path,
    message: msg,
    [path]: msg,
  }));

  console.log(req.body);

  if (!errors.isEmpty()) {
    return next(new ApiError(400, errors.array()));
  }

  next();
};

// we can use `joi` instead, it is more powerful and flexible
// but we are using `express-validator` for this project
