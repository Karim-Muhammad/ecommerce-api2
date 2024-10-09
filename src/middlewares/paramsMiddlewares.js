const SubCategoryModel = require("../models/SubCategory");
const ReviewModel = require("../models/Reviews/schema");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

/**
 * @description Check if the id which exists in the database is related to the given category
 * @route /categories/:categoryId/subcategories/:id
 */
exports.ensureIdRelatedToCategory = catchAsync(async (req, res, next) => {
  if (!req.params.categoryId) return next();

  const subCategory = await SubCategoryModel.findById(req.params.id);

  if (subCategory.category.toString() !== req.params.categoryId) {
    throw new ApiError(400, {
      message: "SubCategory is not related to the category",
    }); // 2#
  }

  next();
});

/**
 * @description Check if the reviewId (id) is related to the given product (productId)
 * @route /products/:productId/reviews/:id
 */
exports.ensureIdRelatedToProduct = catchAsync(async (req, res, next) => {
  if (!req.params.productId) return next();

  const review = await ReviewModel.findById(req.params.id);
  if (review.product.toString() !== req.params.productId)
    return next(
      ApiError.badRequest(
        "Review you working on, doesn't belong to this productId"
      )
    );

  next();
});

/**
 * @description set categoryId to body in Nested Route (category/:id/SubCategory)
 */
exports.setCategoryIdToBody = (req, res, next) => {
  if (req.params.categoryId) {
    req.body.category = req.params.categoryId;
  }

  next();
};

exports.setProductIdToBody = (req, res, next) => {
  if (req.params.productId) {
    req.body.product = req.params.productId;
  }

  next();
};
