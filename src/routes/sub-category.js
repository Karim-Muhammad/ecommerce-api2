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
  setCategoryIdToBody,
  ensureIdRelatedToCategory,
} = require("../rules/sub-category");

// handler can only access parameters of route related to
// but cannot access parameters which outside of the route - [Learn more about mergeParams](https://expressjs.com/en/api.html#express.router)
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getAllSubCategories)
  .post(setCategoryIdToBody, checkBodyDataRule, createSubCategory);

router
  .route("/:id")
  .all(ensureIdMongoId, ensureIdRelatedToCategory) // check if the id is related to the category
  .get(getSubCategory)
  .patch(
    setCategoryIdToBody, // set categoryId to body if it's available in params (nested route)
    checkBodyDataInUpdateRule,
    updateSubCategory
  )
  .delete(deleteSubCategory);

module.exports = router;
