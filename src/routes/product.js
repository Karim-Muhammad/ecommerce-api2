const { Router } = require("express");

const ProductController = require("../controllers/ProductController");

const {
  validateBodyRequest,
  validateBodyUpdateRequest,
} = require("../rules/product");

const {
  ensureIdMongoIdRule,
  isIdMongoIdExistsRule,
} = require("../rules/shared");
const Product = require("../models/Product");
const { uploadFileMiddleware } = require("../middlewares/uploadFileMiddleware");

const router = Router();

router
  .route("/")
  .get(ProductController.getProducts)
  .post(
    ...uploadFileMiddleware("product", "imageCover"),
    validateBodyRequest,
    ProductController.createProduct
  );

// isCategoryIdExist is a middleware that checks if the category exists
// but in ValidateRequest Rule we already do it as a step of validation.

router
  .route("/:id")
  .all(ensureIdMongoIdRule(Product), isIdMongoIdExistsRule(Product))
  .get(ProductController.getProduct)
  .patch(
    validateBodyUpdateRequest,
    // Subcategory is optional, we may do it later
    ProductController.updateProduct
  )
  .delete(ProductController.deleteProduct);

module.exports = router;
