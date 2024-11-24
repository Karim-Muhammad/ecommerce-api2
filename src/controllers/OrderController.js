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
const User = require("../models/User");

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
  const order = await new OrderModel({
    user: req.user.id,
    orderItems: cartItems,
    paymentMethod: PaymentMethodType.CASH,
    totalPrice: totalPriceOfOrder,
  }).save();

  // Decrease Quantity & Increase Sold (in Middlewares of Order Model (OrderSchema.post("save")))

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

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  const { orderId } = req.params;

  const order = await OrderModel.findById(orderId);

  if (order.status === status) {
    return next(ApiError.badRequest("Order status is already the same"));
  }

  order.status = status;
  await order.save();

  if (!order) {
    return next(ApiError.notFound("Order not found"));
  }

  return res.status(200).json({
    success: true,
    message: "Order status updated successfully",
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

/**
 * @description Create payment session for stripe
 * @route       POST /api/v1/orders/checkout-stripe
 * @access      Private (User)
 */
exports.checkoutPaymentSession = catchAsync(async (req, res, next) => {
  const { shippingAddress } = req.body;

  const cart = await CartModel.findOne({ user: req.user.id }).populate({
    path: "cartItems.product",
    select: "name price images",
  });
  if (!cart) {
    return next(ApiError.notFound("Cart not found"));
  }

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
    metadata: {
      address: shippingAddress,
    }, // additional data the we can access later in the webhook (another endpoint in response)
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

//
async function createCardOrder(sessionData) {
  // 1. Find Cart Data
  const cartId = sessionData.client_reference_id;
  const cart = await CartModel.findById(cartId);

  // 2. Get Total Price from session
  const orderPrice = sessionData.amount_total / 100;

  // 3. Get User
  const userEmail = sessionData.customer_email;
  const user = await User.findOne({ email: userEmail });

  // 4. Create Order
  const order = await new OrderModel({
    orderItems: cart.cartItems,
    totalPrice: orderPrice,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethod: PaymentMethodType.CREDIT_CARD,
    user: user.id,
  }).save();

  return order;
}

/**
 * @description Webhook for stripe checkout session
 * @route       POST /webhook-checkout
 * @access      Public
 */
exports.webhookCheckout = catchAsync(async (req, res, next) => {
  const sessionData = req.body;
  const signature = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhook.constructEvent(
      sessionData,
      signature,
      config.stripe_secret_key
    );
  } catch (error) {
    return res.status(500).json({
      error: `Webhook Error ${error.message}`,
    });
  }

  if (event.type === "checkout.session.completed") {
    createCardOrder(event.data.object); // event.data.object it is session data which you sent in previous step
  }

  res.status(200).json({ received: true });
});
