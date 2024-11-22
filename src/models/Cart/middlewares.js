const CartSchema = require("./schema");
// const ProductModel = require("../Product");

console.log("Middlewares loaded");

// returns array of operations [ Works Perfectly ]
async function calcTotalPriceOfCartModel(model, id) {
  // console.log("Model [Calc]", model);
  // console.log("Document ID", id);
  // console.log(await model.find({ _id: id }));

  const totalPriceOperation = await model.aggregate([
    {
      $match: {
        _id: id,
      },
    },
    {
      $unwind: "$cartItems",
    },
    {
      $lookup: {
        from: "products",
        localField: "cartItems.product",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: "$product",
    },
    {
      $project: {
        _id: 1,
        totalPrice: {
          $sum: {
            $multiply: ["$cartItems.quantity", "$product.price"],
          },
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        totalPrice: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);

  // console.log("Total Price Operation", totalPriceOperation);
  return totalPriceOperation;
}

// TODO: apply coupon to cart, and calc next adding products with discount

// async function calcDiscountedPriceOfCartModel(
//   totalPrice = 0,
//   coupons = []
// ) {

//   // get biggest discount coupon
//   const coupon = coupons.reduce((acc, coupon))
//   if (discountType === DiscountType.PERCENTAGE) {
//     return totalPrice - (totalPrice * discountValue) / 100;
//   }

//   return totalPrice - discountValue;
// }

// async function calcTotalPrice(cartItems) {
//   console.log("Cart Items", cartItems);

//   const totalPrice = await cartItems.reduce(async (acc, item) => {
//     const product = await ProductModel.findById(item.product);
//     return acc + product.price * item.quantity;
//   }, 0);

//   return totalPrice;
// }

CartSchema.post(/save/i, async function () {
  const model = this.model(); // not this.model
  // console.log("------ [pre save] [Cart has been saved] ------");
  // console.log("this", this);

  console.log("Modified", this.isModified("totalPriceAfterDiscount"));

  //   calc total price
  const result = await calcTotalPriceOfCartModel(model, this._id);
  // const discountedPrice = await calcDiscountedPriceOfCartModel(
  //   result[0]?.totalPrice || 0,
  //   this.coupons
  // );

  console.log("Result", result);

  await model.updateOne(
    { user: this.user },
    {
      totalPrice: result[0]?.totalPrice || 0, // if result[0] is undefined, then set 0 means all cartitems are deleted
    }
  );

  // console.log("Total Price", this.totalPrice);
  // console.log("[END] [pre save]");
});

// CartSchema.pre("save", async function (next) {
//   const totalPrice = await calcTotalPrice(this.cartItems);
//   console.log("Total Price", totalPrice);

//   this.totalPrice += totalPrice;

//   if (!this.totalPriceAfterDiscount || this.totalPrice === 0) {
//     this.totalPriceAfterDiscount = totalPrice;
//   }
// });
