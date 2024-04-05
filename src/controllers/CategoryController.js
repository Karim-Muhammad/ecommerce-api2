const asyncHandler = require("express-async-handler");
const Category = require("./../models/Category");
const ApiError = require("../utils/ApiError");
const { default: mongoose } = require("mongoose");

/**
 * @description Create a new category
 * @route POST /api/v1/categories
 * @access Private/Admin
 * @request_body { name: "Category Name", description: "Category Description" }
 */
exports.createCategory = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;
  const newCategory = new Category({ name, description });

  try {
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    next(new ApiError(400, error.message, error.stack).toJson());
  }
  // still (asyncHandler) cannot handling error which is inside timers
});

/**
 * @description Get all categories
 * @route GET /api/v1/categories
 * @access Public
 * @request_body { }
 */
exports.getCategories = asyncHandler(async (req, res, next) => {
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 3;
  const skip = (page - 1) * limit;

  const categories = await Category.find({}).skip(skip).limit(limit);
  res.status(200).json({ page, results: categories.length, data: categories });
});

/**
 * @description Get single category
 * @route GET /api/v1/categories/:id
 * @access Public
 * @request_body { }
 */
exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  // if findById doesn't exist it will return `null`
  if (!category) {
    return next(ApiError.notFound("Category not found!"));
  }
  res.status(200).json(category);
});

/**
 * @description Update single category
 * @route UPDATE /api/v1/categories/:id
 * @access Private/Admin
 * @request_body { name: "Category Name", description?: "Category Description" }
 */
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const updates = Object.keys(req.body);
  const isAllowedFields = Category.isFillable(updates);

  // if there is a field that is not allowed
  if (!isAllowedFields) {
    return next(ApiError.badRequest("Invalid Fields!"));
  }

  try {
    // you pass all request.body because you sure now, all body keys are allowed
    // no more fields, but it can be less, and these less may be required in schema
    // but this has its own catch error from mongoose
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return the new updated category
      // if you set it to false, it will return the old category before update
    });

    // 1) Error in Finding
    if (!category) {
      return next(
        ApiError.notFound("Category you try to update is not found!")
      );
    }

    // 2) Category found and updated
    res.status(200).json(category);
  } catch (err) {
    // 3) if there is an errors occured in update (like duplication keys)
    next(ApiError.inServer("something went wrong in updating category!"));
  }
});

/**
 * @description Delete single category
 * @route DELETE /api/v1/categories/:id
 * @access Private/Admin
 * @request_body { }
 */
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  try {
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
  } catch (error) {
    // catch if objectId is not valid (maybe less/more than 24 digits)

    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(ApiError.notFound("Category not found!"));
    }

    // 660c28c66c7f17ff354c3ecf
    // 660c28bb6c7f17ff354c3eca <- valid (digit is 24)
    return next(ApiError.inServer(error.message));
  }
});
