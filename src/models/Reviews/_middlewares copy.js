const ReviewSchema = require("./schema");
const ProductModel = require("../Product");

ReviewSchema.pre(/^find/, function (next) {
  console.log("Populating user");
  this.populate("user", "username");
  next();
});

ReviewSchema.post("save", async function () {
  console.log("After saveing review");
  console.log("Constructor", this.constructor);

  // 1#
  const product = await ProductModel.findById(this.product);

  const result = await this.constructor.getAvgRatingsOfProduct2(this.product);
  console.log("Result", result);

  product.ratingAvg = result.avgRating;
  product.ratingCount = result.countRating;

  await product.save();
});

// any action that has delete in it
ReviewSchema.post(/delete/i, async (doc) => {
  console.log("After Deleting review");
  console.log("doc", doc);

  // 1#
  const product = await ProductModel.findById(doc.product);
  // const result = this.constructor.getAvgRatingsOfProduct2(doc.product); 2#
  product.ratingCount -= 1;

  if (product.ratingCount === 0) {
    product.ratingAvg = 0;
    await product.save();
    return;
  }

  // formula to calculate avg rating
  const avg =
    (product.ratingAvg * (product.ratingCount + 1) - doc.rating) /
    product.ratingCount;

  product.ratingAvg = avg;

  await product.save();
});

// 2# we can instead of these ways, we use aggregate to get avg rating
ReviewSchema.statics.getAvgRatingsOfProduct2 = async function (productId) {
  const result = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        countRating: { $sum: 1 },
      },
    },
  ]);

  console.log("Result", result);

  return result[0];
};
