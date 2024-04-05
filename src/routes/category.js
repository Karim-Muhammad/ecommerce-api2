const express = require("express");
const router = express.Router();

const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/CategoryController");

router.route("/").get(getCategories).post(createCategory);

router
  .route("/:id")
  .get(getCategory)
  .patch(updateCategory)
  .delete(deleteCategory);

// router.use((err, req, res, next) => {});

module.exports = router;
