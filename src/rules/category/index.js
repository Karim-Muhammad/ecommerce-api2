const { param, body } = require("express-validator");
const { doValidate } = require("../../validators");

// we can use `check` instead of `param` for query, body, header, etc. (it is more generic)
// but we will stick with `param` it is more readable and specific

exports.getCategoryRule = [
  // 1) Rules
  param("id").isMongoId().withMessage("Category ID is not valid!"),

  // 2) Validate
  doValidate,
];

exports.createCategoryRule = [
  body("name")
    .notEmpty()
    .withMessage("Category 'name' must be filled!")
    .isLength({ min: 3 })
    .withMessage("Category 'name' must be at least 3 chars")
    .isLength({ max: 32 })
    .withMessage("Category 'name' must be at most 32 chars"),

  body("description")
    // if exist so it must, be not empty and between 10 and 100 chars, otherwise it is optional
    .optional({ values: ["", null] })
    .isLength({ min: 10 })
    .withMessage("Category 'description' must be at least 10 chars")
    .isLength({ max: 100 })
    .withMessage("Category 'description' must be at most 100 chars"),

  body("status").optional().isIn(["active", "inactive"]),

  // 2) Validate
  doValidate,
];

exports.updateCategoryRule = [
  body("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Category 'name' must be at least 3 chars")
    .isLength({ max: 32 })
    .withMessage("Category 'name' must be at most 32 chars"),

  body("description")
    // if exist so it must, be not empty and between 10 and 100 chars, otherwise it is optional
    .optional({ values: ["", null] })
    .isLength({ min: 10 })
    .withMessage("Category 'description' must be at least 10 chars")
    .isLength({ max: 100 })
    .withMessage("Category 'description' must be at most 100 chars"),

  body("status").optional().isIn(["active", "inactive"]),

  // 2) Validate
  doValidate,
];

exports.deleteCategoryRule = [
  // 1) Rules
  param("id").isMongoId().withMessage("Category ID is not valid!"),

  // 2) Validate
  doValidate,
];
