const ReviewModel = require("../models/Reviews/schema");
const {
  ensureIdMongoIdRule,
  isIdMongoIdExistsRule,
} = require("../rules/shared");

const {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne,
} = require("../utils/CRUDController");

/**
 * @description Create a new review on product
 * @route POST /api/v1/reviews
 * @access Private/Admin/Manager
 * @request_body { product: :id, text: "Product amazing", rating: 5 }
 */
exports.createReview = createOne(ReviewModel);

/**
 * @description Get all reviews
 * @route GET /api/v1/reviews
 * @access Public
 * @request_body { }
 */
exports.getAllReviews = async (req, res, next) => {
  const filter = {};
  if (req.params.productId) {
    // BUG: i cannot validate product id in this case, how to do it?
    filter.product = req.params.productId;
  }

  return await getAll(ReviewModel)(req, res, next, filter);
};

/**
 * @description Get single review
 * @route GET /api/v1/reviews/:id
 * @access Public
 * @request_body { }
 */
exports.getReview = getOne(ReviewModel);

/**
 * @description Update single review
 * @route PATCH /api/v1/reviews/:id
 * @access Private
 * @request_body { text: "Product amazing", rating: 5 }
 * @param { id } - Review ID
 * @response { data: { review } }
 */
exports.updateReview = updateOne(ReviewModel);

/**
 * @description Delete single review
 * @route DELETE /api/v1/reviews/:id
 * @access Private
 * @request_body { }
 * @param { id } - Review ID
 */
exports.deleteReview = deleteOne(ReviewModel);
