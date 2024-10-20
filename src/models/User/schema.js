const { Schema, default: mongoose } = require("mongoose");

const UserSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: [true, "User {PATH} is required"],
    unique: true,
  },
  slug: {
    type: String,
    lowercase: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: [true, "User {PATH} is required"],
  },
  password: {
    type: String,
    required: [true, "User {PATH} is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  passwordChangedAt: Date,

  // password reset
  passwordResetToken: String,
  passwordResetExpires: Date,
  passwordResetVerified: Boolean,

  // email verification
  email_verified_at: Date,

  // soft delele account
  deletedAt: Date,

  profileImage: String,
  phone: String,

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  address: [
    {
      id: mongoose.Schema.Types.ObjectId,
      alias: String,
      details: String,
      city: String,
      postalCode: String,
      phone: String,
    },
  ],
});

module.exports = UserSchema;
