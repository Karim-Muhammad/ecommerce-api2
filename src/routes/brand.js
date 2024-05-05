const { Router } = require("express");
const BrandController = require("../controllers/BrandController");
const {
  checkBrandBodyRule,
  checkBrandBodyUpdateRule,
  ensureIdMongoIdRule,
  isIdMongoIdExistsRule,
} = require("../rules/brand");

const router = Router();

router
  .route("/")
  .post(checkBrandBodyRule, BrandController.createBrand)
  .get(BrandController.getBrands);

router
  .route("/:id")
  .all(ensureIdMongoIdRule, isIdMongoIdExistsRule)
  .patch(checkBrandBodyUpdateRule, BrandController.updateBrand) // you don't need to always check (!brand)
  .get(BrandController.getBrand) // you don't need to always check (!brand)
  .delete(BrandController.deleteBrand); // you don't need to always check (!brand)

/**
 * checkBrandBodyRule before update not a little bit a problem
 * because we can update the brand without changing either name, description, or status
 * so we can make it optional
 * so we need to create another rule for updateBrand
 */

module.exports = router;
