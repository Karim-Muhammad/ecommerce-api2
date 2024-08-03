const { Router } = require("express");

const {
  signUpUserRule,
  signInUserRule,
  forgotPasswordRule,
  verifyPasswordResetCodeRule,
  resetPasswordRule,
  changePasswordRule,
} = require("../rules/auth");

const { AuthController } = require("../controllers/AuthController");

const {
  guarding,
  reverseGuarding,
} = require("../middlewares/authenticationMiddlewares");
const { uploadFileMiddleware } = require("../middlewares/uploadFileMiddleware");

const { updateUserRule } = require("../rules/user");

const { excludeFromBody } = require("../helpers");

const router = Router();

// [ME Account]
router.get("/me", guarding(), AuthController.me());

// [UPDATE PROFILE]
router.patch(
  "/update-profile",
  guarding(),
  ...uploadFileMiddleware("user", { profileImage: 1 }),
  excludeFromBody(["password", "role", "email"], true),
  updateUserRule,
  AuthController.updateProfile()
);

// [CHANGE PASSWORD]
router.patch(
  "/change-password",
  guarding(),
  changePasswordRule,
  AuthController.changePassword()
);

// [DEACTIVATE ACCOUNT]
router.post(
  "/account/deactivate",
  guarding(),
  AuthController.deactivateAccount()
);

// [ACTIVATE ACCOUNT]
router.post("/account/activate", guarding(), AuthController.activateAccount());

// [SIGNOUT]
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
