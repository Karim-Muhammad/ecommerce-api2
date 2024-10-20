const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

/**
 * @description Add product to wishlist
 * @route POST /wishlist/add
 * @access Private/Authenticated
 */
exports.addToWishlist = catchAsync(async (req, res, next) => {
  const { productId } = req.body;
  const { user } = req;

  // Check first if the product is in the wishlist
  const currentUser = await User.findById(user.id);
  const isProductInWishlist = currentUser.wishlist.includes(productId);
  if (isProductInWishlist) {
    return next(ApiError.badRequest("Product is already in the wishlist"));
  }

  currentUser.wishlist.push(productId);

  currentUser
    .save()
    .then(() => {
      res.status(200).json({
        status: "success",
      });
    })
    .catch(() => next(ApiError.inServer("Something went wrong")));
});

/**
 * @description Remove product from wishlist
 * @route POST /wishlist/remove
 * @access Private/Authenticated
 */

exports.removeFromWishlist = catchAsync(async (req, res, next) => {
  const { productId } = req.body;
  const { user } = req;
  const currentUser = await User.findById(user.id);

  //   Check first if the product is in the wishlist
  const isProductInWishlist = currentUser.wishlist.includes(productId);
  if (!isProductInWishlist) {
    return next(ApiError.badRequest("Product is not in the wishlist"));
  }

  currentUser.wishlist = currentUser.wishlist.filter(
    (id) => id.toString() !== productId
  );

  currentUser
    .save()
    .then(() => {
      res.status(200).json({
        status: "success",
      });
    })
    .catch(() => next(ApiError.inServer("Something went wrong")));
});

/**
 * @description Get all wishlist products
 * @route GET /wishlist
 * @access Private/Authenticated
 */

exports.getWishlist = catchAsync(async (req, res, next) => {
  const { user } = req;
  const allWishlistProducts = await User.findById(user.id).populate(
    "wishlist",
    "name price"
  );

  res.status(200).json({
    status: "success",
    data: allWishlistProducts.wishlist,
  });
});
