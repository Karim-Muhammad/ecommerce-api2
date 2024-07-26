const { body } = require("express-validator");
const { doValidate } = require("../../validators");

/**
 * @description check if the data passed in the body is matched the required fields.
 */
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
    .if(body("description").exists())
    .isLength({ min: 10 })
    .withMessage(
      "Category 'description' must be at least 10 chars, or don't send it in request!"
    )
    .isLength({ max: 100 })
    .withMessage("Category 'description' must be at most 100 chars"),

  // Equivalent to: if(body("status").exists()) body("status").isIn(["active", "inactive"])
  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Category 'status' must be either 'active' or 'inactive'."),

  // 2) Validate
  doValidate,
];

/**
 * @description check if the data passed in the body is matched the required fields.
 */
exports.updateCategoryRule = [
  body("name")
    .if(body("name").exists())
    .isLength({ min: 3 })
    .withMessage("Category 'name' must be at least 3 chars")
    .isLength({ max: 32 })
    .withMessage("Category 'name' must be at most 32 chars"),

  body("description")
    .if(body("description").exists())
    .isLength({ min: 10 })
    .withMessage("Category 'description' must be at least 10 chars")
    .isLength({ max: 100 })
    .withMessage("Category 'description' must be at most 100 chars"),
  // .optional({ values: ["", null] })
  // if exist so it must, be not empty and between 10 and 100 chars, otherwise it is optional

  body("status").optional().isIn(["active", "inactive"]),

  // 2) Validate
  doValidate,
];
