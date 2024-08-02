const Brand = require("../models/Brand");

const {
  deleteOne,
  getOne,
  getAll,
  createOne,
  updateOne,
} = require("../utils/CRUDController");

/**
 * @description Create a new brand
 * @route POST /api/v1/brands
 * @access Private/Admin/Manager
 * @request_body { name: "Brand Name", description: "Brand Description", status: "active" }
 */
exports.createBrand = createOne(Brand);

/**
 * @description Get all brands
 * @route GET /api/v1/brands
 * @access Public
 * @request_body { }
 * @query { page: 1, limit: 2 }
 * @response { page: 1, length: 2, data: [ { brand1 }, { brand2 } ] }
 */
exports.getBrands = getAll(Brand);

/**
 * @description Get single brand
 * @route GET /api/v1/brands/:id
 * @access Public
 * @request_body { }
 * @param { id } - Brand ID
 * @response { data: { brand } }
 * @error { 404: "Brand with id ${brandId} not found" }
 */
exports.getBrand = getOne(Brand);

/**
 * @description Update single brand
 * @route PUT /api/v1/brands/:id
 * @access Private/Admin/Manager
 * @request_body { name: "Brand Name", description: "Brand Description", status: "active" }
 * @param { id } - Brand ID
 * @response { data: { brand } }
 * @error { 404: "Brand with id ${brandId} not found" }
 */
exports.updateBrand = updateOne(Brand);

/**
 * @description Delele single brand
 * @route DELETE /api/v1/brands/:id
 * @access Private/Admin
 * @request_body { }
 * @param { id } - Brand ID
 * @response { data: null }
 * @error { 404: "Brand with id ${brandId} not found" }
 */
exports.deleteBrand = deleteOne(Brand);
