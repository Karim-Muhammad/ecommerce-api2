const { body, param } = require("express-validator");

const { default: mongoose } = require("mongoose");

const Category = require("../../models/Category");

const ApiError = require("../../utils/ApiError");

const { doValidate } = require("../../validators");
const catchAsync = require("../../utils/catchAsync");
const SubCategoryModel = require("../../models/SubCategory");

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

  body("categoryId")
    .notEmpty()
    .withMessage("categoryId is required!")
    .if((value) => !!value)
    .isMongoId()
    .withMessage("categoryId must be id of category")
    .if((value) => mongoose.Types.ObjectId.isValid(value))
    .custom(async (value, { req }) => {
      const category = await Category.findById(value);

      if (!category) {
        throw new ApiError(404, "Category not found :(");
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
    .notEmpty() // but this will be executed if the value is empty as well. So, we need to use `if` to prevent this
    .withMessage("name is required!")
    .isLength({ min: 2, max: 32 })
    .withMessage("name must be between min (2) and max (32)"),

  body("categoryId")
    .notEmpty()
    .withMessage("categoryId is required!")
    .if((value) => !!value)
    .isMongoId()
    .withMessage("categoryId must be valid id")
    .if((value) => mongoose.Types.ObjectId.isValid(value)),

  doValidate,
];
/** ====================================== [Body.] ================================ */

/** ====================================== [MongoId] ================================ */
/**
 * @description Check if the id is a valid MongoId
 */
exports.ensureIdMongoId = [
  param("id").isMongoId().withMessage("id must be a valid MongoId"),
  doValidate,
];

/**
 * @description Check if the id exists in the database
 */
exports.isIdMongoIdExists = [
  // ID is valid or not
  param("id").custom(async (value) => {
    const subCategory = await SubCategoryModel.findById(value);

    if (!subCategory) {
      throw new Error("SubCategory not found :(");
    }

    return true;
  }),

  doValidate,
];

/** ====================================== [MongoId.] ================================ */
