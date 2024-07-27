const { body } = require("express-validator");

const { default: mongoose } = require("mongoose");

const Category = require("../../models/Category");

const ApiError = require("../../utils/ApiError");

const { doValidate } = require("../../validators");

/** ====================================== [Body] ================================ */
/**
 * @description Check the passed body if contains all needed fields data.
 */
exports.checkBodyDataRule = [
  body("name").notEmpty().withMessage("name is required!"),
  body("name")
    .isLength({ min: 2 })
    .withMessage("name must be at least 2 chars")
    .isLength({ max: 32 })
    .withMessage("name must be at most 32 chars"),

  body("category")
    .notEmpty()
    .withMessage("categoryId is required!")
    .if((value) => !!value)
    .isMongoId()
    .withMessage("categoryId must be id of category")
    .if((value) => mongoose.Types.ObjectId.isValid(value))
    .custom(async (value, { req }) => {
      const category = await Category.findById(value);

      if (!category) {
        // statusCode won't work as we expect because of the `doValidate` functions
        // which catch error and then throw it again with the status code 400
        throw new ApiError(404, { message: "Category not found :(" });
      }

      return true; // exists. continue the chain...
    }),

  doValidate,
];

/**
 * @description Check the passed body if contains all needed fields data.
 */
exports.checkBodyDataInUpdateRule = [
  body("name")
    .if(body("name").exists()) // if the value exists
    .notEmpty() // but this will be executed if the value is empty as well. So, we need to use `if` to prevent this
    .withMessage("name is required!")
    .isLength({ min: 2, max: 32 })
    .withMessage("name must be between min (2) and max (32)"),

  body("categoryId")
    .if(body("categoryId").exists())
    .notEmpty()
    .withMessage("categoryId is required!")
    .if((value) => !!value)
    .isMongoId()
    .withMessage("categoryId must be valid id")
    .if((value) => mongoose.Types.ObjectId.isValid(value)),

  doValidate,
];
/** ====================================== [Body.] ================================ */
