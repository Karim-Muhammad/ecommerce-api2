const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} = require("../utils/CRUDController");

class UserController {
  constructor() {
    this.model = User;
  }

  /**
   * @description Get all users
   * @route GET /api/v1/users
   * @access Private (Admin only)
   */
  getAll() {
    return getAll(this.model);
  }

  /**
   * @description Get one user
   * @route GET /api/v1/users/:id
   * @access Private (Admin only)
   * @returns
   */
  getOne() {
    return getOne(this.model);
  }

  /**
   * @description Create one user
   * @route POST /api/v1/users
   * @access Private (Admin only)
   * @returns
   */
  createOne() {
    return createOne(this.model);
  }

  /**
   * @description Update one user
   * @route PATCH /api/v1/users/:id
   * @access Private (Admin only)
   * @returns
   */
  updateOne() {
    return updateOne(this.model);
  }

  /**
   * @description Delete one user
   * @route DELETE /api/v1/users/:id
   * @access Private (Admin only)
   * @returns
   */
  deleteOne() {
    // different logic if you want (deactivate for example)
    return deleteOne(this.model);
  }

  /**
   * @description Change Password of User
   * @route PATCH /api/v1/users/:id/change-password
   * @access Private (Admin only)
   * @returns
   */
  changePassword() {
    return async (req, res, next) => {
      const user = await User.findById(req.params.id).select("+password");

      user.password = req.body["new-password"];
      user.passwordChangedAt = Date.now();

      try {
        user.save();
      } catch (error) {
        return next(ApiError.inServer(error.message));
      }

      res.status(200).json({
        status: "Successfully changed the password!",
      });
    };
  }
}

module.exports = new UserController();
