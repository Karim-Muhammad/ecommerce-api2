const { Router } = require("express");

const { signUpUserRule, signIpUserRule } = require("../rules/auth");
const { AuthController } = require("../controllers/AuthController");
const { guarding } = require("../middlewares/authenticationMiddlewares");

const router = Router();

router.post("/signup", signUpUserRule, AuthController.signup());
router.post("/signin", signIpUserRule, AuthController.signin());
router.post("/signout", AuthController.signout());
router.post("/forgot-password", AuthController.forgotPassword());
router.patch("/reset-password", AuthController.resetPassword());
router.patch("/change-password", AuthController.changePassword());
router.post("/verify-email", AuthController.verifyEmail());
router.post(
  "/resend-email-verification",
  AuthController.resendEmailVerification()
);
router.get("/me", guarding(), AuthController.me());

module.exports = router;
