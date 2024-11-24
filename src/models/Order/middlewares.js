const OrderSchema = require("./schema");
const ProductModel = require("../Product");
const CartModel = require("../Cart");
const { OrderStatus } = require("../../helpers/constants");

// either save or update
OrderSchema.post(/save|update/gi, async function (doc) {
  console.log("Order saved", this, "doc:", doc);

  const { orderItems } = doc;

  // Decrease Quantity of Product and increase Sold of Product
  // 4. After creating order, decrease the quantity of the product and increase the sold field
  if (
    doc.status !== OrderStatus.REFUND &&
    doc.status !== OrderStatus.CANCELLED &&
    doc.status !== OrderStatus.REJECTED
  ) {
    const bulkOptions = orderItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));

    await ProductModel.bulkWrite(bulkOptions, { ordered: true });
    // and clear the cart

    // 5. Clear the cart
    await CartModel.findOneAndDelete({ user: doc.user });
  } else {
    // 6. If order is cancelled or refunded, increase the quantity of the product and decrease the sold field
    const bulkOptions = orderItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: +item.quantity, sold: -item.quantity } },
      },
    }));

    await ProductModel.bulkWrite(bulkOptions, { ordered: true });
  }
});
