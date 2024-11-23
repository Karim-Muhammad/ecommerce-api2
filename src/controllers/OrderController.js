// Payment Gateway
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const CartModel = require("../models/Cart");
const OrderModel = require("../models/Order");
const ProductModel = require("../models/Product");

const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const factory = require("../utils/CRUDController");
const { PaymentMethodType } = require("../helpers/constants");
const config = require("../../config");

/**
 * @desc    Create cash order
 * @route   POST /api/v1/orders/cash
 * @access  Private
 */
exports.createCashOrder = catchAsync(async (req, res, next) => {
  // 0. Get Tax price, shipping price for admin or vendor (store owner)
  // get owmer based on the product (store owner)
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1. Get cart from the user
  const cart = await CartModel.findOne({ user: req.user.id });
  if (!cart) {
    return next(new ApiError(404, "Cart not found"));
  }

  // 2. Get total price from the cart (with discount if exists)
  const { cartItems, totalPriceAfterDiscount, totalPrice } = cart;
  const totalPriceOfOrder =
    (totalPriceAfterDiscount || totalPrice) + taxPrice + shippingPrice;

  // 3. Create order
  const order = await OrderModel.create({
    user: req.user.id,
    orderItems: cartItems,
    paymentMethod: PaymentMethodType.CASH,
    totalPrice: totalPriceOfOrder,
  });

  if (order) {
    // 4. After creating order, decrease the quantity of the product and increase the sold field
    const bulkOptions = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));

    await ProductModel.bulkWrite(bulkOptions, { ordered: true });
    // and clear the cart

    // 5. Clear the cart
    await CartModel.findOneAndDelete({ user: req.user.id });
  }

  return res.status(201).json({
    success: true,
    message: "Order created successfully",
    order,
  });
});

/**
 * TODO: User/Admin/Vendors Orders
 * @description Get all orders
 * @route       GET /api/v1/orders
 * @access      Private (User|Admin)
 */

exports.getOrders = catchAsync(async (req, res, next) => {
  const filter = {};
  if (req.user.role === "user") {
    filter.user = req.user.id;
  }

  return await factory.getAll(OrderModel)(req, res, next, filter);
});

/**
 * @description Update pay status of order either (paid or not)
 * @route      PATCH /api/v1/orders/:orderId/pay
 * @access     Private (Admin)
 */
exports.acceptOrderPay = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;
  const order = await OrderModel.findById(orderId);
  if (!order) {
    return next(ApiError.notFound("Order not found"));
  }

  order.isPaid = true;
  order.paidAt = Date.now();

  await order.save();

  return res.status(200).json({
    success: true,
    message: "Order paid successfully",
    order,
  });
});

exports.rejectOrderPay = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;
  const order = await OrderModel.findById(orderId);

  if (!order) {
    return next(ApiError.notFound("Order not found"));
  }

  order.isPaid = false;
  order.paidAt = null;

  await order.save();

  return res.status(200).json({
    success: true,
    message: "Order payment rejected",
    order,
  });
});

/**
 * @description Update pay status of order either (delivered or not)
 * @route      PATCH /api/v1/orders/:orderId/deliver
 * @access     Private (Admin)
 */
exports.updateOrderDeliver = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;
  const order = await OrderModel.findById(orderId);
  if (!order) {
    return next(ApiError.notFound("Order not found"));
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();

  await order.save();

  return res.status(200).json({
    success: true,
    message: "Order delivered successfully",
    order,
  });
});

exports.checkoutPaymentSession = catchAsync(async (req, res, next) => {
  const { shippingAddress } = req.body;

  const cart = await CartModel.findOne({ user: req.user.id }).populate({
    path: "cartItems.product",
    select: "name price images",
  });
  if (!cart) {
    return next(ApiError.notFound("Cart not found"));
  }

  console.log("Cartitem", cart.cartItems[0].product);
  const { totalPriceAfterDiscount, totalPrice } = cart;

  const paymentIntent = await stripe.checkout.sessions.create({
    line_items: cart.cartItems.map((item) => ({
      price_data: {
        currency: "egp",
        product_data: {
          images: [`${config.base_url}/products/${item.product.images[0]}`],
          name: item.product.name,
        },
        unit_amount: item.product.price * 100,
      },
      quantity: item.quantity,
    })),

    mode: "payment",
    metadata: shippingAddress, // additional data the we can access later in the webhook (another endpoint in response)
    customer_email: req.user.email,
    client_reference_id: cart.id, // after this payment is successful, we can use this id to update the order
    cancel_url: `${req.protocol}://${req.get("host")}/api/v1/cart`,
    success_url: `${req.protocol}://${req.get("host")}/api/v1/orders`,
  });

  return res.status(200).json({
    success: true,
    message: "Payment session created successfully",
    paymentIntent,
  });
});
