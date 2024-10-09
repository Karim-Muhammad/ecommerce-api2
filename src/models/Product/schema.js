const { Schema, default: mongoose } = require("mongoose");

/**
 * All fields are required except for the following:
 * - priceAfterDiscount
 * - images
 * - colors
 * - sizes
 * - subCategory
 * - brand
 * - ratingAvg
 * - ratingCount
 * - reviews
 */
const Product = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [3, "Product name must be at least 3 characters"],
      maxlength: [255, "Product name must not be more than 255 characters"],
      unique: true,
    },

    slug: {
      type: String,
      // required: [true, "Product slug is required"],
      lowercase: true,
      unique: true,
    },

    description: {
      type: String,
      required: [true, "Product {PATH} is required"],
      trim: true,
      minlength: [20, "Product {PATH} must be at least 20 characters"],
    },

    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
      min: [1, "Product quantity must be at least 1"],
      default: 1,
    },

    sold: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: [true, "Product {PATH} is required"],
      trim: true,
      min: [0, "Product {PATH} must be at least 0"],
      // max: [1000000, "Product price must not be more than 1,000,000"],
    },

    discount: {
      type: Number,
      min: [0, "Product discount must be at least 0"],
      max: [100, "Product discount must not be more than 100"],
      default: 0,
    },

    priceAfterDiscount: {
      type: Number,
    },

    imageCover: {
      type: String,
      required: [true, "Product `image` cover is required"],
    },

    images: [String],

    colors: [String],

    sizes: [String],

    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must belong to some main category is required"],
    },

    subCategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],

    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },

    // createdBy: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: "User",
    //   required: [true, "Product must be created by some user"],
    // },

    ratingAvg: {
      type: Number,
      min: [1, "Product rating must be at least 1"],
      max: [5, "Product rating must not be more than 5"],
    },

    ratingCount: {
      type: Number,
      default: 0,
    },

    // reviews: []
  },
  {
    timestamps: true,
    virtuals: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = Product;
