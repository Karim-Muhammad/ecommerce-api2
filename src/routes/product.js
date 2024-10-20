const { Router } = require("express");

const ProductController = require("../controllers/ProductController");

const {
  ensureIdMongoIdRule,
  isIdMongoIdExistsRule,
} = require("../rules/shared");

const {
  validateBodyRequest,
  validateBodyUpdateRequest,
} = require("../rules/product");

const { uploadFileMiddleware } = require("../middlewares/uploadFileMiddleware");

const Product = require("../models/Product");
const { restrictTo } = require("../middlewares/authenticationMiddlewares");

const router = Router();

router
  .route("/")
  .get(ProductController.getProducts)
  .post(
    restrictTo("admin", "manager"),
    ...uploadFileMiddleware("product", {
      imageCover: 1,
      images: 4,
    }),

    validateBodyRequest,
    ProductController.createProduct
  );

// isCategoryIdExist is a middleware that checks if the category exists
// but in ValidateRequest Rule we already do it as a step of validation.

router.use("/:productId/reviews", require("./reviews"));

router
  .route("/:id")
  .all(ensureIdMongoIdRule(Product), isIdMongoIdExistsRule(Product))
  .get(ProductController.getProduct)
  .patch(
    restrictTo("admin", "manager"),
    ...uploadFileMiddleware("product", {
      imageCover: 1,
      images: 4,
    }),
    validateBodyUpdateRequest,
    // Subcategory is optional, we may do it later
    ProductController.updateProduct
  )
  .delete(restrictTo("admin", "manager"), ProductController.deleteProduct);

module.exports = router;
