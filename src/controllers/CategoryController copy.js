/**
 * Copy this file to CategoryController.js for the code to work (not production)
 */

const asyncHandler = require("express-async-handler");
const Category = require("./../models/Category");

/**
 * @description Create a new category
 * @route POST /api/v1/categories
 * @access Private/Admin
 * @request_body { name: "Category Name", description: "Category Description" }
 */
exports.createCategory = asyncHandler(async (req, res, next) => {
  const name = req.body.name;
  const newCategory = new Category({ name, description: req.body.description });
  await newCategory.save();
  res.status(201).json(newCategory);

  // still cannot handling error which is inside timers
});

// APPENDIX
createCategory1 = async (req, res, next) => {
  const name = req.body.name;
  const newCategory = new Category({ name, description: req.body.description });
  try {
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (er) {
    next(er);
  }
};
createCategory2 = (req, res, next) => {
  const name = req.body.name;
  const newCategory = new Category({ name, description: req.body.description });

  newCategory
    .save()
    .then((doc) => {
      res.json(doc);
    })
    .catch((er) => {
      res.json(er);
      // or
      // next(er); if you use error handler in app level
    });
};

// you can learn more about async routes and error handling here: https://expressjs.com/en/guide/error-handling.html
