const validator = require("express-validator");

const { doValidate } = require("../../validators");
const ApiError = require("../../utils/ApiError");
const Brand = require("../../models/Brand");
const catchAsync = require("../../utils/catchAsync");

exports.checkBrandBodyRule = [
  validator
    .body("name")
    .notEmpty()
    .withMessage("Brand name is required")
    .isLength({ min: 5 })
    .withMessage("Brand name must be at least 5 characters")
    .isLength({ max: 50 })
    .withMessage("Brand name must not be more than 50 characters"),

  validator
    .body("description")
    .notEmpty()
    .withMessage("Brand description is required"),

  validator
    .body("description")
    .isLength({ min: 5 })
    .withMessage("Brand description must be at least 5 characters"),

  validator
    .body("description")
    .isLength({ max: 200 })
    .withMessage("Brand description must not be more than 200 characters"),

  validator
    .body("status")
    .optional()
    .isBoolean()
    .withMessage("Status must be a boolean"),

  doValidate,
];

exports.checkBrandBodyUpdateRule = [
  validator
    .body("name")
    .optional([null, undefined, ""])
    .notEmpty()
    .withMessage("Brand name is required")
    .isLength({ min: 5 })
    .withMessage("Brand name must be at least 5 characters")
    .isLength({ max: 50 })
    .withMessage("Brand name must not be more than 50 characters"),

  validator
    .body("description")
    .optional([null, undefined, ""])
    .notEmpty()
    .withMessage("Brand description is required"),

  validator
    .body("description")
    .optional([null, undefined, ""])
    .isLength({ min: 5 })
    .withMessage("Brand description must be at least 5 characters"),

  validator
    .body("description")
    .optional([null, undefined, ""])
    .isLength({ max: 200 })
    .withMessage("Brand description must not be more than 200 characters"),

  validator
    .body("status")
    .optional()
    .isBoolean()
    .withMessage("Status must be a boolean"),

  doValidate,
];

exports.ensureIdMongoIdRule = [
  validator.param("id").isMongoId().withMessage("id must be a valid MongoId"),
  doValidate,
];

exports.isIdMongoIdExistsRule = [
  validator.param("id").custom(async (value) => {
    const brand = await Brand.findById(value);

    if (!brand) {
      throw ApiError.notFound("Brand not found");
      // throw new ApiError(404, { message: "Brand not found" }); // working
      // throw new Error("Brand not found"); works
    }

    return true;
  }),

  doValidate,
];
