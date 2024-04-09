const express = require("express");
const router = express.Router();
const { validationResult } = require("express-validator");

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
  .patch(updateCategoryRule, updateCategory)
  .delete(deleteCategoryRule, deleteCategory);
// router.use((err, req, res, next) => {});

module.exports = router;
