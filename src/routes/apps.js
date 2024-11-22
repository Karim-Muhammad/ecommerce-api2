const ApiError = require("../utils/ApiError");
const apps = require(".");

module.exports = (app) => {
  app.use("/api/v1/categories", apps.categoryRoute);
  app.use("/api/v1/sub-categories", apps.subCategoryRoute);
  app.use("/api/v1/brands", apps.brandRoute);
  app.use("/api/v1/products", apps.productRoute);
  app.use("/api/v1/users", apps.userRoute);
  app.use("/api/v1/auth", apps.authRoute);
  app.use("/api/v1/reviews", apps.reviewsRoute);
  app.use("/api/v1/wishlist", apps.wishlistRoute);
  app.use("/api/v1/address", apps.addressRoute);
  app.use("/api/v1/coupons", apps.couponsRoute);
  app.use("/api/v1/cart", apps.cartRoute);
  app.use("/api/v1/app-settings", apps.appSettingsRoute);
  app.use("/api/v1/orders", apps.orderRoute);

  app.all("*", (req, res, next) => {
    res.status(404).json({
      error: ApiError.notFound("Page Not Found!"),
    });
  });
};
