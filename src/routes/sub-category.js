const express = require("express");

const {
  createSubCategory,
  getAllSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
} = require("../controllers/SubCategoryController");

const {
  createSubCategoryRule,
  getSingleSubCategoryRule,
  updateSingleSubCategoryRule,
} = require("../rules/sub-category");

const router = express.Router();

router
  .route("/")
  .get(getAllSubCategories)
  .post(createSubCategoryRule, createSubCategory);

router
  .route("/:id")
  .get(getSingleSubCategoryRule, getSubCategory)
  .patch(
    getSingleSubCategoryRule,
    updateSingleSubCategoryRule,
    updateSubCategory
  )
  .delete(getSingleSubCategoryRule, deleteSubCategory);

module.exports = router;
