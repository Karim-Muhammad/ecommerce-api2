const ApiError = require("../utils/ApiError");
const SubCategory = require("../models/SubCategory");
const catchAsync = require("../utils/catchAsync"); // created by me

/**
 * @description Create a new sub category
 * @route POST /api/v1/sub-categories
 * @access Private/Admin
 */

exports.createSubCategory = catchAsync(async (req, res, next) => {
  const { name, categoryId } = req.body;

  // nested route

  const newSubCategory = await SubCategory.create({
    name,
    category: categoryId,
  });

  res.status(201).json({
    data: newSubCategory,
  });
});

/**
 * @description Get all sub categories
 * @route GET /api/v1/sub-categories
 * @access Public
 */
exports.getAllSubCategories = async (req, res, next) => {
  const paginate = {
    page: +req.query.page || 1,
    limit: +req.query.limit || 2,
    get skip() {
      return (this.page - 1) * this.limit;
    },
  };

  // to get all sub-categories of a specific category
  // otherwise, it will return all sub-categories
  const filter = {};
  if (req.params.categoryId) filter.category = req.params.categoryId;

  const categories = await SubCategory.find(filter)
    .skip(paginate.skip)
    .limit(paginate.limit)
    .populate({
      path: "category",
      select: "name -_id", // to exclude _id from the result
    });

  res.status(200).json({
    page: paginate.page,
    length: categories.length,
    data: categories,
  });
};

/**
 * @description Get specific/single sub-category
 * @route GET /api/v1/sub-categories/:id
 * @access Public
 */
exports.getSubCategory = async (req, res, next) => {
  const { id } = req.params;
  const category = await SubCategory.findById(id);
  // .populate({
  //   path: "category",
  //   select: "name -_id",
  // }); you don't need it here, it consume unnecessary more data

  return res.status(200).json({
    data: category,
  });
};

/**
 * @description Update a sub-category
 * @route PATCH /api/v1/sub-categories/:id
 * @access Private/Admin
 */
exports.updateSubCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (req.body.categoryId) {
    req.body.category = req.body.categoryId;
  }

  const updatedSubCategory = await SubCategory.findOneAndUpdate(
    { _id: id },
    req.body,
    { new: true }
  );

  res.status(200).json({
    data: updatedSubCategory,
  });
});

/**
 * @description Delete a sub-category
 * @route DELETE /api/v1/sub-categories/:id
 * @access Private/Admin
 */
exports.deleteSubCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const category = await SubCategory.findByIdAndDelete(id);

  // we can remove it, because we use middleware to check if the id exists
  if (!category) {
    return next(ApiError.notFound("SubCategory not Found!"));
  }

  res.status(204).json({
    data: null,
  });
});
