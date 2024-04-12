const { default: mongoose } = require("mongoose");

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
exports.createCategory = catchAsync(async (req, res, next) => {
  const { name, description } = req.body;
  // const newCategory = new Category({ description });
  const newCategory = new Category({ name, description });

  try {
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    // sometimes error should be 500 if there is error in code, or 400 if there is error in user input
    // we can remove this catch. and it will handle the message of error
    // BUT the status code will be 500, becaise it is handled by catchAsync

    throw new ApiError(400, error, true);
  }
});

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
  res.status(200).json({ page, results: categories.length, data: categories });
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
  }

  res.status(200).json(category);
};

/**
 * @description Update single category
 * @route UPDATE /api/v1/categories/:id
 * @access Private/Admin
 * @request_body { name: "Category Name", description?: "Category Description" }
 */
exports.updateCategory = async (req, res, next) => {
  const updates = Object.keys(req.body);
  const isAllowedFields = Category.isFillable(updates);

  if (!isAllowedFields) {
    return next(ApiError.badRequest("Invalid Fields!"));
  }

  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    return next(ApiError.notFound("Category you try to update is not found!"));
  }

  res.status(200).json({
    data: category,
  });
};

/**
 * @description Delete single category
 * @route DELETE /api/v1/categories/:id
 * @access Private/Admin
 * @request_body { }
 */
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  // ObjectID is valid (24 digits) but not found

  if (!category) {
    console.log("No Category with this id!");
    // Should use `return` to prevent further execution
    return next(ApiError.notFound("No Category with this id!"));
  }

  console.log("Category deleted successfully!");

  res.status(200).json({
    message: "Category deleted successfully!",
    data: category,
  });
});
