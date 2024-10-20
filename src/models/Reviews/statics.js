const ReviewSchema = require("./schema");

// 1# Way: get calc average rating by get all prev ratings and divideby sun of them

ReviewSchema.statics.getAvgRatingsOfProduct = async function (productId) {
  // 1. Get all reviews of this product
  const reviews = await this.find({ product: productId }).select("rating");
  console.log("Reviews", reviews);
  // 2. Get total of sum of these reviews
  const sumOfAllRatings = reviews.reduce((acc, rate) => acc + rate.rating, 0);
  console.log("Sum", sumOfAllRatings);
  // 3. Get Avergae of this sum
  const avgOfAllRatings = sumOfAllRatings / reviews.length;
  console.log("Avg", avgOfAllRatings);
  return avgOfAllRatings;
};

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
// * @IDEA i see using getAvg should be statics in Product model not in Review model
