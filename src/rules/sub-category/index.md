```js
const { body, param } = require("express-validator");

const { default: mongoose } = require("mongoose");

const Category = require("../../models/Category");

const ApiError = require("../../utils/ApiError");

const { doValidate } = require("../../validators");
const catchAsync = require("../../utils/catchAsync");
const SubCategoryModel = require("../../models/SubCategory");

exports.checkBodyDataRule = [
  body("name").notEmpty().withMessage("name is required!"),
  body("name")
    .isLength({ min: 2 })
    .withMessage("name must be at least 2 chars")
    .isLength({ max: 32 })
    .withMessage("name must be at most 32 chars"),
  // no difference between combine all of validaotors in one middleware or multiple middleware

  body("categoryId")
    .notEmpty()
    .withMessage("categoryId is required!")
    .if((value) => !!value) // if true, process the following validation
    .isMongoId()
    .withMessage("categoryId must be id of category")
    .if((value) => mongoose.Types.ObjectId.isValid(value)) // if this return false, the following chain validation will be stopped
    .custom(async (value, { req }) => {
      // without `if()`, `custom` will be executed, even if previous validation failed!

      /**
       * Check if this Id is exist in database or NOT.
       */

      const category = await Category.findById(value);

      if (!category) {
        throw new ApiError(404, "Category not found :(");
      }

      return true; // exists. continue the chain...
    }),

  doValidate,
];

exports.ensureIdMongoId = [
  // ID is valid or not
  param("id").isMongoId().withMessage("id must be a valid MongoId"),
  doValidate,
];

exports.isIdMongoIdExists = [
  // ID is valid or not
  param("id").custom(async (value) => {
    const subCategory = await SubCategoryModel.findById(value);

    if (!subCategory) {
      throw new ApiError(404, "SubCategory not found :(");
    }

    return true;
  }),

  doValidate,
];

exports.checkBodyDataInUpdateRule = [
  body("name")
    // .optional({ values: ["", undefined] }) // but if it's not empty, it should be validated
    // .if((value) => !!value) // if true, process the following validation
    .notEmpty() // but this will be executed if the value is empty as well. So, we need to use `if` to prevent this
    .withMessage("name is required!")
    .isLength({ min: 2, max: 32 })
    .withMessage("name must be between min (2) and max (32)"),

  body("categoryId")
    // .optional({ values: ["", undefined] })
    // .if((value) => !!value)
    .notEmpty()
    .withMessage("categoryId is required!")
    .if((value) => !!value)
    .isMongoId()
    .withMessage("categoryId must be valid id")
    .if((value) => mongoose.Types.ObjectId.isValid(value)),

  doValidate,
];

/**
 * @description Check if the id which exists in the database is related to the given category
 */
exports.ensureIdRelatedToCategory = catchAsync(async (req, res, next) => {
  const subCategory = await SubCategoryModel.findById(req.params.id);

  // not necessary to check if the subCategory exists or not
  // because we created a middleware to check before this middleware
  // if (!subCategory) {
  //   return next(ApiError.notFound("SubCategory not Found!")); // 1#
  // }

  if (subCategory.category.toString() !== req.params.categoryId) {
    throw new ApiError(400, "SubCategory is not related to the category"); // 2#
  }

  next();
});
```
