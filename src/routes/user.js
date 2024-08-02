const { Router } = require("express");

const UserController = require("../controllers/UserController");
const { uploadFileMiddleware } = require("../middlewares/uploadFileMiddleware");
const User = require("../models/User");
const {
  createUserRule,
  changePasswordRule,
  updateUserRule,
} = require("../rules/user");
const {
  ensureIdMongoIdRule,
  isIdMongoIdExistsRule,
} = require("../rules/shared");
const { preventPasswordUpdate } = require("../helpers");

const router = Router();

router
  .route("/")
  .get(UserController.getAll())
  .post(
    ...uploadFileMiddleware(User, { profileImage: 1 }),
    createUserRule,
    UserController.createOne()
  );

router
  .route("/:id")
  .all(ensureIdMongoIdRule(User), isIdMongoIdExistsRule(User))
  .get(UserController.getOne())
  .patch(
    ...uploadFileMiddleware(User, { profileImage: 1 }),
    preventPasswordUpdate,
    updateUserRule,
    UserController.updateOne()
  )
  .delete(UserController.deleteOne());

router.patch(
  "/:id/change-password",
  ensureIdMongoIdRule(User),
  isIdMongoIdExistsRule(User),
  changePasswordRule,
  UserController.changePassword()
);
module.exports = router;
