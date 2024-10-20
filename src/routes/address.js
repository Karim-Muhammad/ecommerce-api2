const { Router } = require("express");

const router = Router();

const auth = require("../middlewares/authenticationMiddlewares");
const {
  addAddress,
  removeAddress,
  getAddresses,
} = require("../controllers/AddressController");

const { addAddress: addAddressRule } = require("../rules/address");

router.use(auth.guarding());

// TODO: add validations layer
router.post("/add", addAddressRule, addAddress);
router.post("/remove", removeAddress);

router.get("/", getAddresses);

module.exports = router;
