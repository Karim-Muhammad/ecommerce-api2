const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the Home Route",
  });
});

module.exports = router;
