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
  .all(getCategoryRule)
  .get(getCategory)
  .patch(updateCategoryRule, updateCategory)
  .delete(deleteCategoryRule, deleteCategory);

router.use("/:categoryId/sub-categories", require("./sub-category"));
// router.use("/:id/products", require("./product"));
module.exports = router;
