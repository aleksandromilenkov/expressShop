const Product = require("../models/productModel");

const getAddProduct = (req, res) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

const getEditProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("admin/edit-product", {
    pageTitle: "Edit Product",
    path: "/admin/edit-product",
    product: product,
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
    res.status(400).json({
      status: "error",
      message: "Invalid inputs",
    });
    console.log(err);
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ userId: req.user._id });
    res.render("admin/products", {
      products,
      pageTitle: "Admin Products",
      path: "/admin/products",
      hasProducts: products.length > 0,
    });
  } catch (err) {
    console.log(err);
  }
};

const editProduct = async (req, res) => {
  const { id } = req.params;
  if (req.user._id !== id) {
  }
  const product = await Product.findById(id);
  if (product.userId.toString() !== req.user._id.toString()) {
    return res.status(400).json({
      status: "error",
      message: "Can't edit this product",
    });
  }
  const updatedProduct = await Product.findByIdAndUpdate(id, req.body);
  res.status(200).json({
    status: "success",
    data: updatedProduct,
  });
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const resp = await Product.deleteOne({ _id: id, userId: req.user._id });
  if (resp.deletedCount === 0) {
    return res.status(400).json({
      status: "error",
      message: "Can't delete this product",
    });
  }
  return res.status(200).json({
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
