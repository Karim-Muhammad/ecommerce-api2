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
      // wihtout `if()`, this will be executed also, even if previous validation failed!

      // if (!mongoose.Types.ObjectId.isValid(value)) {
      //   throw new Error(`Invalid category id: ${value}`);
      // }

      const category = await Category.findById(value);

      if (!category) {
        throw new ApiError(404, "Category not found :(");
      }

      return true;
    }),

  doValidate,
];

exports.ensureIdMongoId = [
  param("id").isMongoId().withMessage("id must be a valid MongoId"),
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

// this middleware is used to set categoryId to body in Nested Route (category/:id/SubCategory)
exports.setCategoryIdToBody = (req, res, next) => {
  if (req.params.categoryId) {
    req.body.categoryId = req.params.categoryId;
  }

  next();
};

exports.ensureIdRelatedToCategory = catchAsync(async (req, res, next) => {
  const category = await SubCategoryModel.findById(req.params.id);

  if (!category) {
    return next(ApiError.notFound("SubCategory not Found!"));
  }

  if (category.category.toString() !== req.params.categoryId) {
    throw new ApiError(400, "SubCategory is not related to the category");
  }

  next();
});
