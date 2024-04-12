const express = require("express");

const router = express.Router();

const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/CategoryController");

const {
  getCategoryRule,
  createCategoryRule,
  updateCategoryRule,
  deleteCategoryRule,
} = require("../rules/category");

router.route("/").get(getCategories).post(createCategoryRule, createCategory);

router
  .route("/:id")
  .get(getCategoryRule, getCategory)
  .patch(getCategoryRule, updateCategoryRule, updateCategory)
  .delete(getCategoryRule, deleteCategoryRule, deleteCategory);

router.use("/:categoryId/subcategories", require("./sub-category"));
// router.use("/:id/products", require("./product"));
module.exports = router;
