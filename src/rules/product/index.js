const { isValidObjectId } = require("mongoose");

const validate = require("express-validator");

const { doValidate } = require("../../validators");
const CategoryModel = require("../../models/Category");
const SubCategory = require("../../models/SubCategory");

exports.isIdMongoId = [
  validate
    .param("id")
    .isMongoId()
    .withMessage("Product ID must be a valid MongoDB ID."),

  doValidate,
];

exports.validateBodyRequest = [
  validate
    .body("name")
    .notEmpty()
    .withMessage("Product name is required.")
    .isLength({ min: 3 })
    .withMessage("Product name must be at least 3 characters")
    .isLength({ max: 255 })
    .withMessage("Product name must not be more than 255 characters"),

  validate
    .body("description")
    .notEmpty()
    .withMessage("Product description is required.")
    .isLength({ min: 20 })
    .withMessage("Product description must be at least 20 characters."),

  validate
    .body("quantity")
    .notEmpty()
    .isNumeric()
    .withMessage("Product quantity is required numeric field."),

  validate
    .body("price")
    .notEmpty()
    .withMessage("Product price is required.")
    .isNumeric()
    .withMessage("Product price must be numeric."),

  validate
    .body("discount")
    .optional({ values: "falsy" })
    .isNumeric()
    .isInt({ min: 0, max: 100 })
    .withMessage("Product discount must be a number between 0 and 100."),

  validate
    .body("priceAfterDiscount")
    .optional({ values: "falsy" })
    .isNumeric()
    .toFloat()
    .custom((value, { req }) => {
      if (value >= req.body.price) {
        throw new Error("Price after discount must be less than the price.");
      }

      return true;
    }),

  validate
    .body("imageCover")
    .notEmpty()
    .withMessage("Product image cover is required."),
  // .isURL()
  // .withMessage("Product image cover must be a valid URL."),

  validate
    .body("category")
    .notEmpty()
    .withMessage("Product category is required.")
    .isMongoId()
    .withMessage("Product category must be a valid MongoDB ID.")
    .custom(async (value, { req }) => {
      const category = await CategoryModel.findById(value);
      if (!category)
        throw new Error(`Category with ID ${value} does not exist.`);

      req.body.category = value;
      return true;
    }),

  // It was go through this layer, which means even if category doesn't exist, it will go to next middle(route) and execute controller.
  // .custom(async (value, { req }) => {
  //   CategoryModel.findById(value).then((category) => {
  //     if (!category) {
  //       console.log("Category with ID", value, "does not exist.");
  //       throw new Error(`Category with ID ${value} does not exist.`);
  //     }

  //     req.body.category = value;
  //     return true;
  //   });
  // }),

  // ======== Optionals =========
  validate
    .body("colors")
    .if(validate.body("colors").exists())
    .isArray()
    .withMessage("Colors must be an array.")
    .isLength({ min: 1 })
    .withMessage("Colors must have at least 1 item."),

  validate
    .body("sizes")
    .optional({ values: "falsy" }) // this is like if(validate.body("sizes").exists())
    .isArray()
    .withMessage("Sizes must be an array.")
    .isLength({ min: 1 })
    .withMessage("Sizes must have at least 1 item."),

  validate
    .body("images")
    .optional({ values: "falsy" })
    .isArray()
    .isLength({ min: 1 })
    .withMessage("Images must have at least 1 item."),

  validate
    .body("subCategories")
    .optional({ values: "falsy" })
    .isArray()
    .isLength({ min: 1 })
    .withMessage("Sub categories must have at least 1 item.")
    .custom(async (subCategories, { req }) => {
      const isValid = subCategories.every((subCategory) =>
        isValidObjectId(subCategory)
      );

      if (!isValid) {
        throw new Error("Sub categories must be valid MongoDB IDs.");
      }

      // const allExistsPromises = subCategories.map((subCategory) =>
      //   SubCategory.findById(subCategory)
      // );
      // const _allExists = await Promise.all(allExistsPromises);
      // const allExists = _allExists.every((isExist) => isExist);

      // way 2#
      const allExists = await SubCategory.find({
        _id: { $exists: true, $in: subCategories },
      });

      if (allExists.length !== subCategories.length)
        throw new Error("some sub categories doesn't exists");

      // Check if These SubCategories belong to Category
      const isSubCategoriesBelongsToCategory = allExists.every(
        (subCategory) => subCategory.category.toString() === req.body.category
      );

      if (!isSubCategoriesBelongsToCategory) {
        throw new Error("Some sub categories don't belongs to category");
      }

      return true;
    }),

  validate
    .body("brand")
    .optional({ values: "falsy" })
    .isMongoId()
    .withMessage("Brand must be a valid MongoDB ID."),

  doValidate,
];

/**
 * You can assign it to many sub-category but single category
 * [test case]: assign it to sub-category that not related to the category
 */

exports.validateBodyUpdateRequest = [
  validate
    .body("name")
    .if(validate.body("name").exists())
    .isLength({ min: 3 })
    .withMessage("Product name must be at least 3 characters")
    .isLength({ max: 255 })
    .withMessage("Product name must not be more than 255 characters"),

  validate
    .body("description")
    .if(validate.body("description").exists())
    .isLength({ min: 20 })
    .withMessage("Product description must be at least 20 characters."),

  validate
    .body("quantity")
    .if(validate.body("quantity").exists())
    .isInt({ min: 1 }),

  validate.body("price").optional(),

  validate
    .body("imageCover")
    .if(validate.body("imageCover").exists())
    .isURL()
    .withMessage("Product image cover must be a valid URL."),

  validate
    .body("category")
    .if(validate.body("category").exists())
    .isMongoId()
    .withMessage("Product category must be a valid MongoDB ID.")
    .custom((value, { req }) => {
      CategoryModel.findById(value).then((category) => {
        if (!category)
          throw new Error(`Category with ID ${value} does not exist.`);
      });

      req.body.category = value;
      return true;
    }),
  // ======== Optionals =========
  validate
    .body("colors")
    .if(validate.body("colors").exists())
    .isArray()
    .withMessage("Colors must be an array.")
    .isLength({ min: 1 })
    .withMessage("Colors must have at least 1 item."),

  validate
    .body("sizes")
    .if(validate.body("sizes").exists())
    .isArray()
    .withMessage("Sizes must be an array.")
    .isLength({ min: 1 })
    .withMessage("Sizes must have at least 1 item."),

  validate
    .body("images")
    .if(validate.body("images").exists())
    .isArray()
    .isLength({ min: 1 })
    .withMessage("Images must have at least 1 item.")
    .custom((images) => {
      const isValid = images.every((image) => validate.isURL(image));

      if (!isValid) {
        throw new Error("Images must be valid URLs.");
      }

      return true;
    }),

  validate
    .body("subCategory")
    .if(validate.body("subCategory").exists())
    .isArray()
    .isLength({ min: 1 })
    .withMessage("Sub categories must have at least 1 item.")
    .custom(async (subCategories) => {
      const isValid = subCategories.every((subCategory) =>
        isValidObjectId(subCategory)
      );

      if (!isValid) {
        throw new Error("Sub categories must be valid MongoDB IDs.");
      }

      return true;
    }),

  validate
    .body("brand")
    .if(validate.body("brand").exists())
    .isMongoId()
    .withMessage("Brand must be a valid MongoDB ID."),

  doValidate,
];
