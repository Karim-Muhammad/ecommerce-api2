const Product = require("./schema");

Product.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});
