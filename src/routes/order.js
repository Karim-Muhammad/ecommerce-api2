const { Router } = require("express");
const {
  createCashOrder,
  getOrders,
  updateOrderDeliver,
  acceptOrderPay,
} = require("../controllers/OrderController");

const {
  guarding,
  restrictTo,
} = require("../middlewares/authenticationMiddlewares");

const router = Router();

router.use(guarding());

router.get("/", getOrders);

router.post("/cash", restrictTo("user"), createCashOrder);

router.patch("/:orderId/pay", restrictTo("admin"), acceptOrderPay);
router.patch("/:orderId/deliver", restrictTo("admin"), updateOrderDeliver);

module.exports = router;
