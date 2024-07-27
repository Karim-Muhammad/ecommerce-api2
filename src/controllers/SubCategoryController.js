const SubCategory = require("../models/SubCategory");

const QueryFeatures = require("../utils/QueryFeatures");

const {
  getOne,
  deleteOne,
  createOne,
  updateOne,
  getAll,
} = require("../utils/CRUDController");

/**
 * @description Create a new sub category
 * @route POST /api/v1/sub-categories
 * @access Private/Admin
 */

exports.createSubCategory = createOne(SubCategory);

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

  return await getAll(SubCategory)(req, res, next, filter);
};

/**
 * @description Get specific/single sub-category
 * @route GET /api/v1/sub-categories/:id
 * @access Public
 */
exports.getSubCategory = getOne(SubCategory);

/**
 * @description Update a sub-category
 * @route PATCH /api/v1/sub-categories/:id
 * @access Private/Admin
 */
exports.updateSubCategory = updateOne(SubCategory);

/**
 * @description Delete a sub-category
 * @route DELETE /api/v1/sub-categories/:id
 * @access Private/Admin
 */
exports.deleteSubCategory = deleteOne(SubCategory);
