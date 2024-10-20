const ReviewSchema = require("./schema");
const ProductModel = require("../Product");

ReviewSchema.pre(/^find/, function (next) {
  console.log("Populating user");
  this.populate("user", "username");
  next();
});

ReviewSchema.post("save", async function () {
  console.log("After saveing review");
  // console.log("Constructor", this.constructor);

  // 1#
  const product = await ProductModel.findById(this.product);

  const result = await this.constructor.getAvgRatingsOfProduct2(this.product);
  // console.log("Result", result);

  product.ratingAvg = result.avgRating;
  product.ratingCount = result.countRating;

  await product.save();
});

// any action that has delete in it
/**
 * `this` -> refer to query not document
 */
ReviewSchema.post(/(delete|update)/i, async function (doc) {
  console.log("After Deleting review");
  console.log("This", this);
  console.log("args", this.arguments);
  console.log("Document", doc);

  // 1#
  const product = await ProductModel.findById(doc.product);
  const result = await this.model.getAvgRatingsOfProduct2(doc.product); // 2#

  product.ratingCount = result.countRating;
  product.ratingAvg = result.avgRating || 0;

  await product.save();
});
