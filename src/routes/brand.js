const { Router } = require("express");

// =================== [MODELS] ===================
const Brand = require("../models/Brand");

// =================== [CONTROLLERS] ===================
const BrandController = require("../controllers/BrandController");

// =================== [RULES] ===================
const {
  checkBrandBodyRule,
  checkBrandBodyUpdateRule,
} = require("../rules/brand");

const {
  ensureIdMongoIdRule,
  isIdMongoIdExistsRule,
} = require("../rules/shared");
const { uploadFileMiddleware } = require("../middlewares/uploadFileMiddleware");
const { restrictTo } = require("../middlewares/authenticationMiddlewares");

// =================== [ROUTES] ===================
const router = Router();

router
  .route("/")
  .post(
    restrictTo("admin", "manager"),
    ...uploadFileMiddleware("brand", { image: 1 }),
    checkBrandBodyRule,
    BrandController.createBrand
  )
  .get(BrandController.getBrands);

router
  .route("/:id")
  .all(ensureIdMongoIdRule(Brand), isIdMongoIdExistsRule(Brand)) // you don't need to always check (!brand)
  .patch(
    restrictTo("admin", "manager"),
    checkBrandBodyUpdateRule,
    BrandController.updateBrand
  )
  .get(BrandController.getBrand)
  .delete(restrictTo("admin", "manager"), BrandController.deleteBrand);

/**
 * checkBrandBodyRule before update not a little bit a problem
 * because we can update the brand without changing either name, description, or status
 * so we can make it optional
 * so we need to create another rule for updateBrand
 */

module.exports = router;
