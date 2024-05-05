const SubCategoryModel = require("../models/SubCategory");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

/**
 * @description Check if the id which exists in the database is related to the given category
 */
exports.ensureIdRelatedToCategory = catchAsync(async (req, res, next) => {
  const subCategory = await SubCategoryModel.findById(req.params.id);

  if (!req.params.categoryId) return next();

  if (subCategory.category.toString() !== req.params.categoryId) {
    throw new ApiError(400, {
      message: "SubCategory is not related to the category",
    }); // 2#
  }

  next();
});

/**
 * @description set categoryId to body in Nested Route (category/:id/SubCategory)
 */
exports.setCategoryIdToBody = (req, res, next) => {
  if (req.params.categoryId) {
    req.body.categoryId = req.params.categoryId;
  }

  next();
};
