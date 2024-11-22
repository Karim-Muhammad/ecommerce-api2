const catchAsync = require("../utils/catchAsync");
const AppSettings = require("../models/AppSettings");
const ApiError = require("../utils/ApiError");

exports.getAppSettings = catchAsync(async (req, res, next) => {
  const appSettings = await AppSettings.findOne({ user: req.user.id });

  if (!appSettings) {
    return next(ApiError.notFound("App settings not found!"));
  }

  return res.status(200).json({
    success: true,
    data: appSettings,
  });
});

exports.updateAppSettings = catchAsync(async (req, res, next) => {
  // TODO: Add validation for the request body
  const appSettings = await AppSettings.findOneAndUpdate(
    { user: req.user.id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!appSettings) {
    await AppSettings.create({
      ...req.body,
      user: req.user.id,
    });
  }

  return res.status(200).json({
    success: true,
    data: req.body,
  });
});
