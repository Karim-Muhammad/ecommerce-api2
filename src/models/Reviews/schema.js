const mongoose = require("mongoose");

const Review = new mongoose.Schema(
  {
    text: {
      type: String,
    },

    rating: {
      type: Number,
      required: true,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must can not be more than 5"],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

Review.pre(/^find/, function (next) {
  this.populate("user", "username");
  next();
});

module.exports = mongoose.model("Review", Review);
