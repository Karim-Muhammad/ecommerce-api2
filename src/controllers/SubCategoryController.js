const ApiError = require("../utils/ApiError");
const SubCategory = require("../models/SubCategory");
const catchAsync = require("../utils/catchAsync"); // created by me
const QueryFeatures = require("../utils/QueryFeatures");

/**
 * @description Create a new sub category
 * @route POST /api/v1/sub-categories
 * @access Private/Admin
 */

exports.createSubCategory = catchAsync(async (req, res, next) => {
  const { name, categoryId } = req.body;

  // nested route

  const newSubCategory = await SubCategory.create({
    name,
    category: categoryId,
  });

  res.status(201).json({
    data: newSubCategory,
  });
});

/**
 * @description Get all sub categories
 * @route GET /api/v1/sub-categories
 * @access Public
 */
exports.getAllSubCategories = async (req, res, next) => {
  // to get all sub-categories of a specific category
  // otherwise, it will return all sub-categories
  const filter = {};
  if (req.params.categoryId) filter.category = req.params.categoryId;

  const subCategoriesQuery = SubCategory.find(filter).populate({
    path: "category",
    select: "name -_id", // to exclude _id from the result
  });

  const { mongooseQuery, pagination } = await new QueryFeatures(
    subCategoriesQuery,
    req.query
  ).all();

  const subCategories = await mongooseQuery;

  res.status(200).json({
    pagination,
    length: subCategories.length,
    data: subCategories,
  });
};

/**
 * @description Get specific/single sub-category
 * @route GET /api/v1/sub-categories/:id
 * @access Public
 */
exports.getSubCategory = async (req, res) => {
  const category = await SubCategory.findById(req.params.id);

  return res.status(200).json({
    data: category,
  });
};

/**
 * @description Update a sub-category
 * @route PATCH /api/v1/sub-categories/:id
 * @access Private/Admin
 */
exports.updateSubCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (req.body.categoryId) {
    req.body.category = req.body.categoryId;
  }

  const updatedSubCategory = await SubCategory.findOneAndUpdate(
    { _id: id },
    req.body,
    { new: true }
  );

  res.status(200).json({
    data: updatedSubCategory,
  });
});

/**
 * @description Delete a sub-category
 * @route DELETE /api/v1/sub-categories/:id
 * @access Private/Admin
 */
exports.deleteSubCategory = catchAsync(async (req, res, next) => {
  await SubCategory.findByIdAndDelete(req.params.id);

  res.status(204).json({
    data: null,
  });
});
