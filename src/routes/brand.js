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

// =================== [ROUTES] ===================
const router = Router();

router
  .route("/")
  .post(checkBrandBodyRule, BrandController.createBrand)
  .get(BrandController.getBrands);

router
  .route("/:id")
  .all(ensureIdMongoIdRule(Brand), isIdMongoIdExistsRule(Brand)) // you don't need to always check (!brand)
  .patch(checkBrandBodyUpdateRule, BrandController.updateBrand)
  .get(BrandController.getBrand)
  .delete(BrandController.deleteBrand);

/**
 * checkBrandBodyRule before update not a little bit a problem
 * because we can update the brand without changing either name, description, or status
 * so we can make it optional
 * so we need to create another rule for updateBrand
 */

module.exports = router;
