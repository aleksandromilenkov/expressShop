const fs = require("fs");
const path = require("path");
const Order = require("../models/ordersModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const PDFDocument = require("pdfkit");
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
    const error = new Error(err);
    error.httpStatus = 500;
    console.log(error);
    return next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatus = 500;
    console.log(error);
    return next(error);
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
    const error = new Error(err);
    error.httpStatus = 500;
    console.log(error);
    return next(error);
  }
};

const getCart = async (req, res, next) => {
  try {
    const products = await req.user.populate({
      path: "cart.items.productId",
    });
    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      products: products.cart.items,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatus = 500;
    console.log(error);
    return next(error);
  }
};

const postCart = async (req, res, next) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    await req.user.addToCart(product);
    await req.user.populate({
      path: "cart.items.productId",
    });
    res.status(201).json({
      status: "success",
      data: product,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatus = 500;
    console.log(error);
    return next(error);
  }
};

const deleteCart = async (req, res, next) => {
  try {
    const { id } = req.params;
    await req.user.removeFromCart(id);
    res.status(200).json({
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

const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ "user.userId": req.user._id });
    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders: orders,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatus = 500;
    console.log(error);
    return next(error);
  }
};

const postOrder = async (req, res, next) => {
  try {
    const products = await req.user.populate("cart.items.productId");
    const adjustedProducts = products.cart.items.map((item) => {
      return {
        product: { ...item.productId._doc },
        quantity: item.quantity,
      };
    });
    const order = await Order.create({
      products: adjustedProducts,
      user: {
        email: req.user.email,
        userId: req.user._id,
      },
    });
    await req.user.clearCart();
    res.status(201).json({
      status: "success",
      order: order,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatus = 500;
    console.log(error);
    return next(error);
  }
};

const getCheckout = (req, res, next) => {
  try {
    res.render("shop/checkout", {
      path: "/checkout",
      pageTitle: "Checkout",
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatus = 500;
    console.log(error);
    return next(error);
  }
};

const getInvoice = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
      return next(new Error("No order found."));
    }
    if (order.user.userId.toString() !== req.user._id.toString()) {
      return next(new Error("Unauthorized"));
    }
    const invoiceName = `invoice-${orderId}.pdf`;
    const invoicePath = path.join("data", "invoices", invoiceName);
    const pdfDoc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'inline; filename="' + invoiceName + '"'
    );
    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    // Response(res) object is writable stream.
    // So you can use readable streams(const pdfDoc) to pipe their output to writable stream
    pdfDoc.pipe(res);
    pdfDoc.fontSize(26).text("Invoice", { underline: true });
    pdfDoc.text("--------------------------");
    let total = 0;
    order.products.forEach((prod) => {
      total += prod.quantity * prod.product.price;
      pdfDoc
        .fontSize(14)
        .text(
          prod.product.title +
            " - " +
            prod.quantity +
            " x " +
            " $ " +
            prod.product.price
        );
    });
    pdfDoc.text("----------");
    pdfDoc.fontSize(20).text("Total Price: $" + total);

    pdfDoc.end();
    // fs.readFile(invoicePath, (err, data) => {
    //   if (err) {
    //     return next(err);
    //   }
    //   res.setHeader("Content-Type", "application/pdf");
    //   res.setHeader(
    //     "Content-Disposition",
    //     'inline; filename="' + invoiceName + '"'
    //   );
    //   res.send(data);
    // });
  } catch (err) {
    const error = new Error(err);
    error.httpStatus = 500;
    console.log(error);
    return next(error);
  }
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
  getInvoice,
};
