const Product = require("../models/Product");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

/**
 * @description Get all products
 * @route GET /api/v1/products
 * @access Public
 * @param {*} req
 * @param {*} res
 * @returns [Products]
 */
exports.getProducts = catchAsync(async (req, res) => {
  const paginate = {
    page: +req.query.page || 1,
    limit: +req.query.limit || 10,
    get skip() {
      return (this.page - 1) * this.limit;
    },
  };

  // if you forgot `await` you will get error Converting circular structure to JSON
  const products = await Product.find({})
    .limit(paginate.limit)
    .skip(paginate.skip);

  return res
    .status(200)
    .json({ page: paginate.page, length: products.length, data: products });
});

/**
 * @description Get single product
 * @route GET /api/v1/products/:id
 * @access Public
 * @param {*} req
 * @param {*} res
 * @returns Product
 */
exports.getProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  return res.status(200).json({
    data: product,
  });
};

/**
 * @description Create a new product
 * @route POST /api/v1/products
 * @access Private/Admin
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.createProduct = async (req, res, next) => {
  // i do pre middleware to create slug, but sincide it is not exist in body, saving thorw an error! because slug is required!!
  const newProduct = new Product(req.body);

  try {
    await newProduct.save();
  } catch (error) {
    return next(new ApiError(400, error.message));
  }

  return res.status(201).json(newProduct);
};

/**
 * @description Update a product
 * @route PUT /api/v1/products/:id
 * @access Private/Admin
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(
    id,
    { ...req.body, slug: "" },
    {
      new: true,
      runValidators: true,
    }
  );

  return res.status(200).json(product);
};

/**
 * @description Delete a product
 * @route DELETE /api/v1/products/:id
 * @access Private/Admin
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  await Product.findByIdAndDelete(id);

  return res.status(204).json();
};
