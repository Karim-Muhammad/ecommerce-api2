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
  // 1) Pagination
  const paginate = {
    page: +req.query.page || 1,
    limit: +req.query.limit || 10,
    get skip() {
      return (this.page - 1) * this.limit;
    },
  };

  // 2) Query Filtering
  const excludedFields = ["page", "limit", "sort", "fields", "search"];
  let filterBy = { ...req.query };

  console.log("===", filterBy);
  excludedFields.forEach((field) => delete filterBy[field]);

  filterBy = JSON.stringify(filterBy);
  filterBy = filterBy.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
  filterBy = JSON.parse(filterBy);

  // if you forgot `await` you will get error Converting circular structure to JSON
  let productsQuery = Product.find(filterBy)
    .limit(paginate.limit)
    .skip(paginate.skip)
    .sort("-createdAt");

  // 3) Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    console.log("Sort By", sortBy);
    productsQuery = productsQuery.sort(sortBy);
  }

  // 4) Limited Fields
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    productsQuery = productsQuery.select(fields);
  } else {
    productsQuery = productsQuery.select("-__v");
  }

  // 5) Search
  if (req.query.search) {
    const searchTerm = req.query.search;

    productsQuery = productsQuery.find({
      $or: [
        {
          name: { $regex: searchTerm, $options: "i" },
        },
        {
          description: { $regex: searchTerm, $options: "i" },
        },
      ],
    });
  }

  // if you forgot `await` you will get error Converting circular structure to JSON
  const products = await productsQuery;

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
