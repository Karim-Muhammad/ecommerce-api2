const CategoryModel = require("../models/Category");

const {
  deleteOne,
  getOne,
  getAll,
  createOne,
  updateOne,
} = require("../utils/CRUDController");

/**
 * @description Create a new category
 * @route POST /api/v1/categories
 * @access Private/Admin/Manager
 * @request_body { name: "Category Name", description: "Category Description" }
 */
exports.createCategory = createOne(CategoryModel);

/**
 * @description Get all categories
 * @route GET /api/v1/categories
 * @access Public
 * @request_body { }
 */
exports.getCategories = getAll(CategoryModel);

/**
 * @description Get single category
 * @route GET /api/v1/categories/:id
 * @access Public
 * @request_body { }
 */
exports.getCategory = getOne(CategoryModel);

/**
 * @description Update single category
 * @route UPDATE /api/v1/categories/:id
 * @access Private/Admin/Manager
 * @request_body { name: "Category Name", description?: "Category Description" }
 */
exports.updateCategory = updateOne(CategoryModel);

/**
 * @description Delete single category
 * @route DELETE /api/v1/categories/:id
 * @access Private/Admin
 * @request_body { }
 */
exports.deleteCategory = deleteOne(CategoryModel);
