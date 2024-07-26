/**
 * Why we use rules and we define constrains in database?
 * because we need to validate the data before we save it in the database.
 * this make our app more faster, secure and reliable.
 *
 * and instead to wait for the database to throw an error because the data is not valid,
 * we can validate it before we send it to the database. (this is the best practice)
 */

const express = require("express");

const router = express.Router();

const CategoryModel = require("../models/Category");
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/CategoryController");

const { createCategoryRule, updateCategoryRule } = require("../rules/category");

const {
  isIdMongoIdExistsRule,
  ensureIdMongoIdRule,
} = require("../rules/shared");

router.route("/").get(getCategories).post(createCategoryRule, createCategory);

router
  .route("/:id")
  .all(ensureIdMongoIdRule(CategoryModel), isIdMongoIdExistsRule(CategoryModel))
  .get(getCategory)
  .patch(updateCategoryRule, updateCategory)
  .delete(deleteCategory);

router.use("/:categoryId/sub-categories", require("./sub-category"));
// router.use("/:id/products", require("./product"));
module.exports = router;
