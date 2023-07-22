const Product = require("../models/productModel");
const getAddProduct = (req, res) => {
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

const createProduct = (req, res) => {
  const newProduct = new Product(req.body.title);
  newProduct.save();
  res.redirect("/");
};

const getProducts = (req, res, next) => {
  const products = Product.fetchAll();
  res.render("shop", {
    products: products,
    pageTitle: "Shop",
    path: "/",
    hasProducts: products.length > 0,
  });
};

module.exports = {
  getAddProduct,
  createProduct,
  getProducts,
};
