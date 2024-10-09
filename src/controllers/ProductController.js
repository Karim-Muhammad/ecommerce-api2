const Product = require("../models/Product");
const {
  deleteOne,
  getOne,
  getAll,
  createOne,
  updateOne,
} = require("../utils/CRUDController");

/**
 * @description Get all products
 * @route GET /api/v1/products
 * @access Public
 * @param {*} req
 * @param {*} res
 * @returns [Products]
 */
exports.getProducts = getAll(Product);

/**
 * @description Get single product
 * @route GET /api/v1/products/:id
 * @access Public
 * @param {*} req
 * @param {*} res
 * @returns Product
 */
exports.getProduct = getOne(Product, {
  populateOptions: [
    {
      path: "reviews",
      select: "text rating -product",
    },
  ],
});

/**
 * @description Create a new product
 * @route POST /api/v1/products
 * @access Private/Admin/Manager
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.createProduct = createOne(Product);

/**
 * @description Update a product
 * @route PUT /api/v1/products/:id
 * @access Private/Admin/Manager
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.updateProduct = updateOne(Product);

/**
 * @description Delete a product
 * @route DELETE /api/v1/products/:id
 * @access Private/Admin/Manager
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.deleteProduct = deleteOne(Product);
