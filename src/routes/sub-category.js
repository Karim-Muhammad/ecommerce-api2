const express = require("express");

const SubCategoryModel = require("../models/SubCategory");
const {
  createSubCategory,
  getAllSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
} = require("../controllers/SubCategoryController");

const {
  checkBodyDataRule,
  checkBodyDataInUpdateRule,
} = require("../rules/sub-category");

const {
  setCategoryIdToBody,
  ensureIdRelatedToCategory,
} = require("../middlewares/paramsMiddlewares");

const {
  ensureIdMongoIdRule,
  isIdMongoIdExistsRule,
} = require("../rules/shared");
const { restrictTo } = require("../middlewares/authenticationMiddlewares");

// handler can only access parameters of route related to
// but cannot access parameters which outside of the route - [Learn more about mergeParams](https://expressjs.com/en/api.html#express.router)
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getAllSubCategories)
  .post(
    restrictTo("admin", "manager"),
    setCategoryIdToBody,
    checkBodyDataRule,
    createSubCategory
  );

router
  .route("/:id")
  .all(
    ensureIdMongoIdRule(SubCategoryModel),
    isIdMongoIdExistsRule(SubCategoryModel),
    ensureIdRelatedToCategory
  )
  .get(getSubCategory)
  .patch(
    restrictTo("admin", "manager"),
    setCategoryIdToBody,
    checkBodyDataInUpdateRule,
    updateSubCategory
  )
  .delete(restrictTo("admin", "manager"), deleteSubCategory);

module.exports = router;
