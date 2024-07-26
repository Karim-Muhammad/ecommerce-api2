const Brand = require("../models/Brand");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const QueryFeatures = require("../utils/QueryFeatures");

/**
 * @description Create a new brand
 * @route POST /api/v1/brands
 * @access Private/Admin
 * @request_body { name: "Brand Name", description: "Brand Description", status: "active" }
 */
exports.createBrand = catchAsync(async (req, res, next) => {
  const { name, description, status } = req.body;
  const newBrand = new Brand({ name, description, status });
  try {
    await newBrand.save();
  } catch (error) {
    throw new ApiError(400, error, true);
  }

  res.status(201).json(newBrand);
});

/**
 * @description Get all brands
 * @route GET /api/v1/brands
 * @access Public
 * @request_body { }
 * @query { page: 1, limit: 2 }
 * @response { page: 1, length: 2, data: [ { brand1 }, { brand2 } ] }
 */
exports.getBrands = catchAsync(async (req, res, next) => {
  const brandsQuery = Brand.find({});
  const { mongooseQuery, pagination } = await new QueryFeatures(
    brandsQuery,
    req.query
  )
    .filter()
    .sort()
    .search("name")
    .projection()
    .paginate();

  const brands = await mongooseQuery;

  return res
    .status(200)
    .json({ pagination, length: brands.length, data: brands });
});

/**
 * @description Get single brand
 * @route GET /api/v1/brands/:id
 * @access Public
 * @request_body { }
 * @param { id } - Brand ID
 * @response { data: { brand } }
 * @error { 404: "Brand with id ${brandId} not found" }
 */
exports.getBrand = catchAsync(async (req, res, next) => {
  const brandId = req.params.id;
  const brand = await Brand.findById(brandId);

  // i didn't check (!brand)

  return res.status(200).json({ data: brand });
});

/**
 * @description Update single brand
 * @route PUT /api/v1/brands/:id
 * @access Private/Admin
 * @request_body { name: "Brand Name", description: "Brand Description", status: "active" }
 * @param { id } - Brand ID
 * @response { data: { brand } }
 * @error { 404: "Brand with id ${brandId} not found" }
 */
exports.updateBrand = catchAsync(async (req, res, next) => {
  const brandId = req.params.id;
  const { name, description, status } = req.body;

  try {
    const brand = await Brand.findByIdAndUpdate(
      brandId,
      { name, description, status },
      { new: true, runValidators: true }
    );

    // i didn't check (!brand)

    return res.status(200).json({ data: brand });
  } catch (error) {
    // console.log(error);
    throw new ApiError(400, error, true);
  }
});

/**
 * @description Delele single brand
 * @route DELETE /api/v1/brands/:id
 * @access Private/Admin
 * @request_body { }
 * @param { id } - Brand ID
 * @response { data: null }
 * @error { 404: "Brand with id ${brandId} not found" }
 */
exports.deleteBrand = catchAsync(async (req, res, next) => {
  const brandId = req.params.id;
  await Brand.findByIdAndDelete(brandId);

  // i didn't check (!brand)

  return res.status(204).json({ data: null });
});
