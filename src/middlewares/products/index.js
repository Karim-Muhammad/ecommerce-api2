const Product = require("../../models/Product");
const Category = require("../../models/Category");
const ApiError = require("../../utils/ApiError");

exports.isIdExist = async (req, res, next) => {
  console.log("IS ID EXIST MIDDLEWARE");

  const { id } = req.params;

  const product = await Product.findById(id);
  console.log("PRODUCT ", product);
  if (!product)
    return next(ApiError.notFound(`Product with ID ${id} not found.`));

  // req.product = product; // good for other middlewares to avoid querying again
  next();
};

exports.isCategoryIdExist = async (req, res, next) => {
  const { category } = req.body;

  // For Update Operation
  // not always in update operation we have category in body!
  if (!category) return next();

  const existCategory = await Category.findById(category);

  if (!existCategory)
    return next(ApiError.notFound(`Category with ID ${category} not found.`));

  next();
};
