```js
const { default: slugify } = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const SubCategory = require("../models/SubCategory");
const catchAsync = require("../utils/catchAsync");

/**
 * @description Create a new sub category
 * @route POST /api/v1/sub-categories
 * @access Private/Admin
 */

exports.createSubCategory = asyncHandler(async (req, res, next) => {
  const { name, categoryId } = req.body;

  const newSubCategory = await SubCategory.create({
    name,
    category: categoryId,
  });

  res.status(201).json({
    data: newSubCategory,
  });
});

exports._createSubCategory = asyncHandler(async (req, res, next) => {
  const { name, categoryId } = req.body;

  try {
    const newSubCategory = await SubCategory.create({
      name,
      category: categoryId,
    });

    res.status(201).json({
      data: newSubCategory,
    });
  } catch (error) {
    throw new Error(`I was Sure not to throw an Error :O ${error.message}`);
  }
});

/**
 * @description Get all sub categories
 * @route GET /api/v1/sub-categories
 * @access Public
 */
exports.getAllSubCategories = asyncHandler(async (req, res, next) => {
  const categories = await SubCategory.find({});
  res.status(200).json({
    data: categories,
  });
});

/**
 * @description Get specific/single sub-category
 * @route GET /api/v1/sub-categories/:id
 * @access Public
 */
exports.getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await SubCategory.findById(id);

  if (!category) {
    return next(ApiError.notFound("SubCategory not Found!"));
  }

  return res.status(200).json({
    data: category,
  });
});

/**
 * @description Update a sub-category
 * @route PATCH /api/v1/sub-categories/:id
 * @access Private/Admin
 */
exports.updateSubCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const updatedSubCategory = await SubCategory.findOneAndUpdate(
    { _id: id },
    {
      name: req.body.name,
      category: req.body.categoryId,
    },
    { new: true }
  );

  if (!updatedSubCategory) {
    return next(ApiError.notFound("SubCategory not Found!"));
  }

  res.status(200).json({
    data: updatedSubCategory,
  });
});

exports._updateSubCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  try {
    // [updateOne] -> doesn't return the updated document, but the query result - has no `new` property
    const updatedSubCategory = await SubCategory.findOneAndUpdate(
      { _id: id },
      {
        name: req.body.name,
        category: req.body.categoryId,
      },
      { new: true }
    );

    if (!updatedSubCategory) {
      return next(ApiError.notFound("SubCategory not Found!"));
    }

    res.status(200).json({
      data: updatedSubCategory,
    });
  } catch (error) {
    throw new Error(`I was Sure not to throw an Error :O ${error.message}`);
  }
});

/**
 * @description Delete a sub-category
 * @route DELETE /api/v1/sub-categories/:id
 * @access Private/Admin
 */

exports.deleteSubCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  await SubCategory.findByIdAndDelete(id);

  res.status(204).json({
    data: null,
  });
});

exports._deleteSubCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  try {
    await SubCategory.findByIdAndDelete(id);

    res.status(204).jsson({
      data: null,
    });
  } catch (error) {
    throw new Error(`I was Sure not to throw an Error :O ${error.message}`);
  }
});
```
