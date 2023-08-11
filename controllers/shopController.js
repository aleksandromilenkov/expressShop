const fs = require("fs");
const path = require("path");
const Order = require("../models/ordersModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const PDFDocument = require("pdfkit");
const stripe = require("stripe")(
  "sk_test_51NRdBLAZza2Mlk9lWSVbCEWz02ViMvfYATGhScwAPLFS1xUEwt8vnUQkWW2pgLgLWZ6LXAohiKxmj5XGpwzlwWYK00MVmcxmgP"
);

const ITEMS_PER_PAGE = 1;

const getProducts = async (req, res, next) => {
  try {
    let page = req.query.page || 1;
    page = +page;
    let totalItems;
    console.log(page, "CURRENT PAGE");
    const numberOfProducts = await Product.find().countDocuments();
    console.log(numberOfProducts, "TOTAL PRODUCTS");
    totalItems = numberOfProducts;
    const products = await Product.find({})
      .skip(ITEMS_PER_PAGE * (page - 1))
      .limit(ITEMS_PER_PAGE);
    res.render("shop/product-list", {
      products: products,
      pageTitle: "Shop",
      path: "/products",
      hasProducts: products.length > 0,
      totalProducts: totalItems,
      currentPage: page,
      hasNextPage: totalItems > page * ITEMS_PER_PAGE,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
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
    let page = req.query.page || 1;
    page = +page;
    let totalItems;
    console.log(page, "CURRENT PAGE");
    const numberOfProducts = await Product.find().countDocuments();
    console.log(numberOfProducts, "TOTAL PRODUCTS");
    totalItems = numberOfProducts;
    const products = await Product.find({})
      .skip(ITEMS_PER_PAGE * (page - 1))
      .limit(ITEMS_PER_PAGE);
    res.render("shop/index", {
      products: products,
      pageTitle: "Shop",
      path: "/",
      hasProducts: products.length > 0,
      totalProducts: totalItems,
      currentPage: page,
      hasNextPage: totalItems > page * ITEMS_PER_PAGE,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
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

const getCheckout = async (req, res, next) => {
  try {
    let products;
    let total = 0;
    const user = await req.user.populate({
      path: "cart.items.productId",
    });
    products = user.cart.items;
    console.log(user.cart.items);
    total = products.reduce((acc, val) => {
      return acc + val.productId.price * val.quantity;
    }, 0);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: products.map((product) => {
        return {
          price_data: {
            product_data: {
              name: product.productId.title,
              description: product.productId.description,
            },
            unit_amount: product.productId.price * 100,
            currency: "usd",
          },
          quantity: product.quantity,
        };
      }),
      customer_email: req.user.email,
      success_url: `${req.protocol}://${req.get("host")}/checkout/success`,
      cancel_url: `${req.protocol}://${req.get("host")}/checkout/cancel`,
      mode: "payment",
    });
    res.render("shop/checkout", {
      path: "/checkout",
      pageTitle: "Checkout",
      products: user.cart.items,
      totalSum: total,
      sessionId: session.id,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatus = 500;
    console.log(error);
    return next(error);
  }
};

const getCheckoutSuccess = async (req, res, next) => {
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
    res.redirect("/orders");
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
  getCheckoutSuccess,
  getProduct,
  getInvoice,
};
