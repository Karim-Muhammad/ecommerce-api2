const express = require("express");

const {
  createSubCategory,
  getAllSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
} = require("../controllers/SubCategoryController");

const {
  checkBodyDataRule,
  ensureIdMongoId,
  checkBodyDataInUpdateRule,
  isIdMongoIdExists,
} = require("../rules/sub-category");

const {
  setCategoryIdToBody,
  ensureIdRelatedToCategory,
} = require("../middlewares/paramsMiddlewares");

// handler can only access parameters of route related to
// but cannot access parameters which outside of the route - [Learn more about mergeParams](https://expressjs.com/en/api.html#express.router)
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getAllSubCategories)
  .post(setCategoryIdToBody, checkBodyDataRule, createSubCategory);

router
  .route("/:id")
  .all(ensureIdMongoId, isIdMongoIdExists, ensureIdRelatedToCategory)
  .get(getSubCategory)
  .patch(setCategoryIdToBody, checkBodyDataInUpdateRule, updateSubCategory)
  .delete(deleteSubCategory);

module.exports = router;
