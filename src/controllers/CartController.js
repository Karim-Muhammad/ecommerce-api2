const CartModel = require("../models/Cart");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const Coupon = require("../models/Coupon");
const Product = require("../models/Product");

exports.AddProductToCart = catchAsync(async (req, res, next) => {
  const { productId, quantity = 1, color } = req.body;
  const isCartExist = await CartModel.findOne({ user: req.user.id });
  const product = await Product.findById(productId);

  // 1. if Cart is not exist
  if (!isCartExist) {
    if (!product) {
      return next(ApiError.notFound("Product is not found!"));
    }

    if (product.quantity < quantity) {
      return next(ApiError.badRequest("Quantity is greater than stock!"));
    }

    const cart = new CartModel({
      user: req.user.id,
      cartItems: [{ product: productId, quantity, color }],
      totalPriceAfterDiscount: undefined,
    });

    await cart.save();

    return res.status(201).json({
      status: "success",
      message: "Product added to cart",
      data: {
        cart,
      },
    });
  }

  // 2. Cart is exist?
  const cart = isCartExist;
  // console.log("CART", cart);
  // console.log("Cart items", cart.cartItems);

  // 2.1 Product is exist in cart?
  const isProductExistInCart = cart.cartItems.findIndex(
    (item) => item.product.toString() === productId && item.color === color
  );

  if (isProductExistInCart !== -1) {
    // console.log("Cart", cart);
    console.log("Product is exist in cart", isProductExistInCart);
    if (
      product.quantity <
      cart.cartItems[isProductExistInCart].quantity + quantity
    ) {
      return next(ApiError.badRequest("Quantity is greater than stock!"));
    }

    cart.cartItems[isProductExistInCart].quantity += quantity;
    await cart.saveIO();

    return res.status(200).json({
      status: "success",
      message: "Product added to cart",
      data: {
        ...cart.cartItems[isProductExistInCart].toObject(),
      },
    });
  }

  // 2.2 Product is not exist in cart?
  console.log("Product is not exist in cart or color is not exist");
  if (product.quantity < quantity) {
    return next(ApiError.badRequest("Quantity is greater than stock!"));
  }

  cart.cartItems.push({ product: productId, quantity, color });
  await cart.saveIO();

  return res.status(201).json({
    status: "success",
    message: "Product added to cart",
    data: {
      product: productId,
      quantity,
      color,
    },
  });
});

exports.updateQuantityOfItem = catchAsync(async (req, res, next) => {
  const { id: itemId } = req.params;
  const { quantity } = req.body;

  const cart = await CartModel.findOne({ user: req.user.id }).populate(
    "cartItems.product",
    "quantity"
  );
  if (!cart) {
    return next(ApiError.notFound("Cart is not found!"));
  }

  // cart exists, check if item exists or not
  const isItemExist = cart.cartItems.findIndex((item) => item.id === itemId);

  if (isItemExist !== -1) {
    const inStock = cart.cartItems[isItemExist].product.quantity;

    if (quantity > inStock) {
      return next(ApiError.badRequest("Quantity is greater than stock!"));
    }

    cart.cartItems[isItemExist].quantity = quantity;
    await cart.save();
    return res.status(200).json({ message: "item updated" });
  }

  return next(ApiError.notFound("Item is not exist in cart!"));
});

exports.decreaseItemFromCart = catchAsync(async (req, res, next) => {
  const { id: itemId } = req.params;
  const cart = await CartModel.findOne({ user: req.user.id });

  if (!cart) {
    return next(ApiError.notFound("Cart is not found!"));
  }

  // cart is exist, check if item exist or not?
  const isItemExist = cart.cartItems.findIndex((item) => item.id === itemId);

  if (isItemExist !== -1) {
    if (cart.cartItems[isItemExist].quantity === 1) {
      // destroy item all
      cart.cartItems = cart.cartItems.filter((item) => item.id !== itemId);
    } else {
      // just decrease
      cart.cartItems[isItemExist].quantity -= 1;
      // await CartModel.updateOne(
      //   { user: req.user.id },
      //   {
      //     $inc: { "cartItems.$[item].quantity": -1 },
      //   },
      //   {
      //     arrayFilters: [{ "item._id": itemId }],
      //   }
      // );
    }

    await cart.save();
    return res.status(204).json({ message: "item removed from cart" });
  }

  console.log(cart.save);
  await cart.save();

  return next(ApiError.notFound("Item is not exist in cart!"));
});

exports.removeItemFromCart = catchAsync(async (req, res, next) => {
  const { id: itemId } = req.params;
  const cart = await CartModel.findOne({ user: req.user.id });

  if (!cart) {
    return next(ApiError.notFound("Cart is not found!"));
  }

  // cart is exist, check if item exist or not?
  const isItemExist = cart.cartItems.findIndex((item) => item.id === itemId);

  if (isItemExist !== -1) {
    cart.cartItems = cart.cartItems.filter((item) => item.id !== itemId);
    await cart.save();
    return res.status(204).json({ message: "item removed from cart" });
  }

  return next(ApiError.notFound("Item is not exist in cart!"));
});

exports.clearCart = catchAsync(async (req, res, next) => {
  const cart = await CartModel.findOne({ user: req.user.id });

  if (!cart) {
    return next(ApiError.notFound("Cart is not found!"));
  }

  await cart.reset();

  return res.status(204).json({ message: "Cart is cleared" });
});

exports.getLoggedInUserCart = catchAsync(async (req, res, next) => {
  const cart = await CartModel.findOne({ user: req.user.id });

  if (!cart) {
    return res.status(404).json({
      status: "fail",
      message: "Cart not found",
    });
  }

  return res.status(200).json({
    status: "success",
    data: {
      cart,
    },
  });
});

exports.applyCoupon = catchAsync(async (req, res, next) => {
  const { coupon: couponName } = req.body;
  // 1. is this coupon valid?
  const coupon = await Coupon.findOne({ name: couponName });
  const isCouponValid = coupon !== null;
  if (!isCouponValid) return next(ApiError.badRequest("Coupon is not valid"));

  // 2. is this coupon expired?
  console.log("Coupon expire", coupon.expire, "Current date", new Date());

  if (coupon.expire < new Date())
    return next(ApiError.badRequest("Coupon is expired"));

  // TODO: check other conditions
  // 3. is this coupon used before?
  // 4. is this coupon is for specific user or not?
  // 5. is this coupon is for specific product or not?
  // 6. is this coupon is for specific category or not?

  // 7. apply coupon
  const cart = await CartModel.findOne({ user: req.user.id });
  const cartTotal = cart.totalPrice;
  const discount = (cartTotal * coupon.discount) / 100;

  cart.coupons.push(coupon._id);
  cart.totalPriceAfterDiscount = cartTotal - discount;

  await cart.save();

  return res.status(200).json({
    status: "success",
    totalPrice: cart.totalPrice,
    totalPriceAfterDiscount: cart.totalPriceAfterDiscount,
  });
});
