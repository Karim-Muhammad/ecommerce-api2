/**
 * Why we use rules and we define constrains in database?
 * because we need to validate the data before we save it in the database.
 * this make our app more faster, secure and reliable.
 *
 * and instead to wait for the database to throw an error because the data is not valid,
 * we can validate it before we send it to the database. (this is the best practice)
 */

const { Router } = require("express");

const {
  isIdMongoIdExistsRule,
  ensureIdMongoIdRule,
} = require("../rules/shared");

const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/CategoryController");

const { createCategoryRule, updateCategoryRule } = require("../rules/category");

const { uploadFileMiddleware } = require("../middlewares/uploadFileMiddleware");

const CategoryModel = require("../models/Category");

const router = Router();

router
  .route("/")
  .get(getCategories)
  .post(
    ...uploadFileMiddleware("category", { image: 1 }),
    createCategoryRule,
    createCategory
  );

router
  .route("/:id")
  .all(ensureIdMongoIdRule(CategoryModel), isIdMongoIdExistsRule(CategoryModel))
  .get(getCategory)
  .patch(
    ...uploadFileMiddleware("category", { image: 1 }),
    updateCategoryRule,
    updateCategory
  )
  .delete(deleteCategory);

router.use("/:categoryId/sub-categories", require("./sub-category"));

module.exports = router;
