const { validationResult } = require("express-validator");
const Product = require("../models/productModel");
const mongoose = require("mongoose");

const getAddProduct = (req, res) => {
  try {
    res.render("admin/add-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatus = 500;
    console.log(error);
    return next(error);
  }
};

const getEditProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      product: product,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatus = 500;
    console.log(error);
    return next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    console.log(req.body, "BODY");
    const title = req.body.title;
    const image = req.file;
    const description = req.body.description;
    const price = req.body.price;
    const errors = validationResult(req);
    if (!image) {
      return res.status(422).json({
        status: "error",
        message: "Attached file is not an image",
        errors: [],
      });
    }
    console.log(image, "IMAGE");
    console.log(errors.array(), "ERROR ARRAY FOR CREATE PRODUCT");
    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: "error",
        message: errors.array()[0].msg,
        errors: errors.array(),
      });
    }
    const imageUrl = image.filename;
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
    // res.status(500).json({
    //   status: "internal-error",
    // });
    const error = new Error(err);
    error.httpStatus = 500;
    console.log(error);
    return next(error);
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
    const error = new Error(err);
    error.httpStatus = 500;
    console.log(error);
    return next(error);
  }
};

const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);
    console.log(errors.array());
    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: "error",
        message: errors.array()[0].msg,
        errors: errors.array(),
      });
    }
    const product = await Product.findById(id);
    if (product.userId.toString() !== req.user._id.toString()) {
      return res.status(400).json({
        status: "error",
        message: "Can't edit this product",
      });
    }
    const title = req.body.title;
    const image = req.file;
    const description = req.body.description;
    const price = req.body.price;
    let imageUrl = "";
    if (image) {
      imageUrl = image.filename;
    } else {
      imageUrl = product.imageUrl;
    }
    if (!image) {
      return res.status(422).json({
        status: "error",
        message: "Attached file is not an image",
        errors: [],
      });
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, {
      title,
      imageUrl,
      description,
      price,
    });
    res.status(200).json({
      status: "success",
      data: updatedProduct,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatus = 500;
    console.log(error);
    return next(error);
  }
};

const deleteProduct = async (req, res) => {
  try {
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
  } catch (err) {
    const error = new Error(err);
    error.httpStatus = 500;
    console.log(error);
    return next(error);
  }
};

module.exports = {
  getAddProduct,
  getEditProduct,
  createProduct,
  getProducts,
  deleteProduct,
  editProduct,
};
