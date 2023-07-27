const Order = require("../models/ordersModel");
const Product = require("../models/productModel");
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.render("shop/product-list", {
      products: products,
      pageTitle: "Shop",
      path: "/products",
      hasProducts: products.length > 0,
    });
  } catch (err) {
    console.log(err);
  }
};

const getProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  res.render("shop/product-detail", {
    product: product,
    pageTitle: product.title,
    path: "/products",
  });
};

const getIndex = async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.render("shop/index", {
      products: products,
      pageTitle: "Shop",
      path: "/",
      hasProducts: products.length > 0,
    });
  } catch (err) {
    console.log(err);
  }
};

const getCart = async (req, res, next) => {
  const products = await req.user.populate({ path: "cart.items.productId" });
  res.render("shop/cart", {
    path: "/cart",
    pageTitle: "Your Cart",
    products: products.cart.items,
  });
};

const postCart = async (req, res, next) => {
  const { id } = req.body;
  const product = await Product.findById(id);
  await req.user.addToCart(product);
  const products = await req.user.populate({ path: "cart.items.productId" });
  res.render("shop/cart", {
    path: "/cart",
    pageTitle: "Your Cart",
    products: products.cart.items,
  });
};

const deleteCart = async (req, res, next) => {
  const { id } = req.params;
  await req.user.removeFromCart(id);
  res.status(204).json({
    status: "success",
    data: null,
  });
};

const getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

const postOrder = async (req, res, next) => {
  try {
    const products = await req.user.populate("cart.items.productId");
    const adjustedProducts = products.cart.items.map((item) => {
      return {
        product: item.productId,
        quantity: item.quantity,
      };
    });
    const order = new Order({
      products: adjustedProducts,
      user: {
        name: req.user.name,
        userId: req.user._id,
      },
    });
    await order.save();
    res.redirect("/orders");
  } catch (err) {
    console.log(err);
  }
};

const getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};

module.exports = {
  getProducts,
  getIndex,
  getCart,
  postCart,
  deleteCart,
  getOrders,
  postOrder,
  getCheckout,
  getProduct,
};
