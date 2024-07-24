const asyncHandler = require("express-async-handler");

const Category = require("../models/Category");

const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

/**
 * @description Create a new category
 * @route POST /api/v1/categories
 * @access Private/Admin
 * @request_body { name: "Category Name", description: "Category Description" }
 */
exports.createCategory = async (req, res, next) => {
  // if we removed `catchAsync` throwing error will crash the app (if express version <5).
  // if Express version >=5, it (throwing error) will be passed to next automatically (for `async` route handlers).
  const newCategory = new Category(req.body);

  try {
    await newCategory.save();
    // we can put it outside try..catch, and express will catch any rejected
    // promise and pass it to next(error) and it will be handled by error handler middleware
    // but we want to customize the error message, so we will use `throw` to throw the user-defined error

    res.status(201).json(newCategory);
  } catch (error) {
    // sometimes error should be 500 if there is error in code, or 400 if there is error in user input
    // we can remove this catch. and it will handle the message of error
    // BUT the status code will be 500, because it is handled by catchAsync

    throw ApiError.badRequest(error.message);
  }
};

/**
 * @description Get all categories
 * @route GET /api/v1/categories
 * @access Public
 * @request_body { }
 */
exports.getCategories = async (req, res, next) => {
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 3;
  const skip = (page - 1) * limit;

  const categories = await Category.find({}).skip(skip).limit(limit);
  res.status(200).json({ page, length: categories.length, data: categories });
};

/**
 * @description Get single category
 * @route GET /api/v1/categories/:id
 * @access Public
 * @request_body { }
 */
exports.getCategory = async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  // if findById doesn't exist it will return `null`

  if (!category) {
    return next(ApiError.notFound("Category not found!"));
    // in Express5, Throw this error will be passed to `next` automatically.
  }

  res.status(200).json({
    data: category,
  });
};

/**
 * @description Update single category
 * @route UPDATE /api/v1/categories/:id
 * @access Private/Admin
 * @request_body { name: "Category Name", description?: "Category Description" }
 */
exports.updateCategory = catchAsync(async (req, res, next) => {
  let category;

  try {
    category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
  } catch (error) {
    return next(ApiError.badRequest(error.message));
  }

  if (!category) {
    return next(ApiError.notFound("Category you try to update is not found!"));
  }

  return res.status(200).json({
    data: category,
  });
});

/**
 * @description Delete single category
 * @route DELETE /api/v1/categories/:id
 * @access Private/Admin
 * @request_body { }
 */
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    // Should use `return` to prevent further execution
    // return next(ApiError.notFound("No Category with this id!"));
    // or
    throw new ApiError(404, "No Category with this id!");
    // asyncHandler library came to solve problem in express < 5,
    // but in in Express >= 5, solved the previous problem, so no need to use it.
  }

  res.status(200).json({
    message: "Category deleted successfully!",
    data: category,
  });
});
