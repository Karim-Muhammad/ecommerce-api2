/**
 * to learn more about `unique`: https://masteringjs.io/tutorials/mongoose/unique
 */

const mongoose = require("mongoose");

//   Create Schema
const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category {PATH} required"],
      // unique: [true, "Category {PATH} must be unique"],
      unique: true, // unique is not validator, it is an index
      minlength: [3, "Too short category {PATH}, min is {VALUE}"],
      maxlength: [32, "Too long category {PATH}, max is {VALUE}"],
    },

    // // Custom Validator
    // validate: {
    //   validator: function (value) {
    //     return /^[a-zA-Z\s]*$/.test(value);
    //   },
    //   message: "Category name must contain only alphabets and spaces",
    // },
    description: {
      type: String,
      minLength: [10, "{PATH} must be at least {VALUE} characters long"],
      maxLength: [100, "{PATH} must be at most {VALUE} characters long"],
      required: false, // Optional
    },

    status: {
      type: String,
      enum: {
        values: ["active", "inactive"],
        default: "active",
        message:
          "{PATH} has value {VALUE} and it is not either active or inactive!",
      },
    },

    slug: {
      type: String,
      lowercase: true,
      // required: [true, "Category {PATH} required"], if you use pre save middleware, you don't need to make it required
      // because it will throw if it is exist.

      // unique: true, // name is unique so slug will be unique
    },

    image: {
      type: String,
      required: [true, "You must upload `image` for category"],
    },
  },
  { timestamps: true }
);

module.exports = CategorySchema;
