const { Router } = require("express");
const {
  AddProductToCart,
  getLoggedInUserCart,
  removeItemFromCart,
  decreaseItemFromCart,
  clearCart,
  updateQuantityOfItem,
  applyCoupon,
} = require("../controllers/CartController");
const { restrictTo } = require("../middlewares/authenticationMiddlewares");

const router = Router();

router.use(restrictTo("user"));

router.post("/", AddProductToCart);
router.get("/", getLoggedInUserCart);
router.delete("/", clearCart);
router.patch("/item/decrease/:id", decreaseItemFromCart);

router.patch("/item/:id", updateQuantityOfItem);
router.delete("/item/:id", removeItemFromCart);

router.patch("/apply-coupon", applyCoupon);

module.exports = router;
