const Product = require("../models/productModel");

const getAddProduct = (req, res) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    isAuthenticated: req.user,
  });
};

const getEditProduct = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Edit Product",
    path: "/admin/edit-product",
    isAuthenticated: req.user,
  });
};

const createProduct = async (req, res) => {
  try {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    const newProduct = await Product.create({
      title,
      imageUrl,
      description,
      price,
      userId: req.user._id,
    });
    res.status(201).json({
      status: "success",
      data: newProduct,
    });
  } catch (err) {
    console.log(err);
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.render("admin/products", {
      products,
      pageTitle: "Admin Products",
      path: "/admin/products",
      hasProducts: products.length > 0,
      isAuthenticated: req.user,
    });
  } catch (err) {
    console.log(err);
  }
};

const editProduct = async (req, res) => {
  const { id } = req.params;
  const resp = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: resp,
  });
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const resp = await Product.findByIdAndDelete(id);
  res.status(204).json({
    status: "success",
    data: null,
  });
};

module.exports = {
  getAddProduct,
  getEditProduct,
  createProduct,
  getProducts,
  deleteProduct,
  editProduct,
};
