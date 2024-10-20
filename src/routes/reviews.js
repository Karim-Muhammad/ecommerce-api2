const { Router } = require("express");
const ReviewModel = require("../models/Reviews");

const {
  getAllReviews,
  createReview,
  getReview,
  updateReview,
  deleteReview,
} = require("../controllers/ReviewController");

const {
  isIdMongoIdExistsRule,
  ensureIdMongoIdRule,
} = require("../rules/shared");

const { restrictTo } = require("../middlewares/authenticationMiddlewares");
const {
  createReviewRule,
  updateReviewRule,
  deleteReviewRule,
} = require("../rules/reviews");
const {
  setProductIdToBody,
  ensureIdRelatedToCategory,
  ensureIdRelatedToProduct,
} = require("../middlewares/paramsMiddlewares");

const router = Router({ mergeParams: true });

router
  .route("/")
  .get(getAllReviews)
  .post(restrictTo("user"), setProductIdToBody, createReviewRule, createReview);

router
  .route("/:id")
  .all(
    ensureIdMongoIdRule(ReviewModel),
    isIdMongoIdExistsRule(ReviewModel),
    ensureIdRelatedToProduct
  )
  .get(getReview)
  .patch(restrictTo("user"), updateReviewRule, updateReview)
  .delete(restrictTo("user", "admin"), deleteReviewRule, deleteReview);

module.exports = router;
