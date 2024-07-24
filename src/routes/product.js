const { Router } = require("express");

const ProductController = require("../controllers/ProductController");

const {
  validateBodyRequest,
  isIdMongoId,
  validateBodyUpdateRequest,
} = require("../rules/product");

const { isIdExist } = require("../middlewares/products");

const router = Router();

router
  .route("/")
  .get(ProductController.getProducts)
  .post(validateBodyRequest, ProductController.createProduct);

// isCategoryIdExist is a middleware that checks if the category exists
// but in ValidateRequest Rule we already do it as a step of validation.

router
  .route("/:id")
  .all(isIdMongoId, isIdExist)
  .get(ProductController.getProduct)
  .patch(
    validateBodyUpdateRequest,
    // Subcategory is optional, we may do it later
    ProductController.updateProduct
  )
  .delete(ProductController.deleteProduct);

module.exports = router;
