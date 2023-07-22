const Product = require("../models/productModel");
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});
    console.log(products);
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

const getCart = (req, res, next) => {
  res.render("shop/cart", {
    path: "/cart",
    pageTitle: "Your Cart",
  });
};

const getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
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
  getOrders,
  getCheckout,
};
