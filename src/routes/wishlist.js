const { Router } = require("express");

const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require("../controllers/WishlistController");
const auth = require("../middlewares/authenticationMiddlewares");

const router = Router();

// TODO: add validations layer
router.use(auth.guarding());

router.post("/add", addToWishlist);
router.post("/remove", removeFromWishlist);
router.get("/", getWishlist);

module.exports = router;
