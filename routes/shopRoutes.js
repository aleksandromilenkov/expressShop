const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/shopController");
const { protect } = require("../controllers/authController");

router.get("/", getIndex);
router.get("/products", getProducts);
router.get("/products/:id", getProduct);
router.get("/cart", protect, getCart);
router.post("/cart", protect, postCart);
router.delete("/cart/:id", protect, deleteCart);
router.get("/orders", protect, getOrders);
router.post("/create-order", protect, postOrder);
router.get("/checkout", protect, getCheckout);

router.get("/checkout/success", getCheckoutSuccess);
router.get("/checkout/cancel", getCheckout);

router.get("/orders/:orderId", protect, getInvoice);
router.get("/checkout", protect, getCheckout);

module.exports = router;
