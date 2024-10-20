const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

/**
 * @description Add address to user
 * @route POST /address/add
 * @access Private/Authenticated
 */
exports.addAddress = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { address } = req.body;

  User.findByIdAndUpdate(
    user.id,
    {
      $push: { address },
    },
    {
      new: true,
    }
  )
    .then((doc) => {
      res.status(200).json({
        status: "success",
        data: doc.address,
      });
    })
    .catch(() => next(ApiError.inServer("Something went wrong")));
});

/**
 * @description remove address
 * @route POST /address/remove
 * @access Private/Authenticated
 */
exports.removeAddress = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { addressId } = req.body;

  User.findByIdAndUpdate(user.id, {
    $pull: { address: { _id: addressId } },
  })
    .then((doc) => {
      res.status(200).json({
        status: "success",
        data: doc.address,
      });
    })
    .catch(() => next(ApiError.inServer("Something went wrong")));
});

/**
 * @description get all addresses
 * @route GET /address
 * @access Private/Authenticated
 */
exports.getAddresses = catchAsync(async (req, res, next) => {
  const { user } = req;

  User.findById(user.id)
    .then((doc) => {
      res.status(200).json({
        status: "success",
        data: doc.address,
      });
    })
    .catch(() => next(ApiError.inServer("Something went wrong")));
});
