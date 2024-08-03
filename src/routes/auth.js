const { Router } = require("express");

const {
  signUpUserRule,
  signInUserRule,
  forgotPasswordRule,
  verifyPasswordResetCodeRule,
  resetPasswordRule,
} = require("../rules/auth");

const { AuthController } = require("../controllers/AuthController");

const {
  guarding,
  reverseGuarding,
} = require("../middlewares/authenticationMiddlewares");

const router = Router();

router.get("/me", guarding(), AuthController.me());
router.put("/update-profile", guarding(), AuthController.updateProfile());
router.patch("/change-password", guarding(), AuthController.changePassword());
router.post("/signout", guarding(), AuthController.signout());

router.use(reverseGuarding());

// [SIGNUP]
router.post("/signup", signUpUserRule, AuthController.signup());

// [SIGNIN]
router.post("/signin", signInUserRule, AuthController.signin());

// [FORGOT PASSWORD] -> Send Reset Code
router.post(
  "/forgot-password",
  forgotPasswordRule,
  AuthController.forgotPassword()
);

// [VERIFY RESET CODE] -> Verify Reset Code
router.patch(
  "/verify-password-reset-code",
  verifyPasswordResetCodeRule,
  AuthController.verifyResetCode()
);

// [RESET NEW PASSWORD] -> Reset New Password
router.patch(
  "/reset-password",
  resetPasswordRule,
  AuthController.resetPassword()
);

// ======================================[TODO]=========================================
// [EMAIL VERIFICATION]
router.post("/verify-email", AuthController.verifyEmail());
router.post(
  "/resend-email-verification",
  AuthController.resendEmailVerification()
);

module.exports = router;
