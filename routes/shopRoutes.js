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
  getProduct,
} = require("../controllers/shopController");

router.get("/", getIndex);
router.get("/products", getProducts);
router.get("/products/:id", getProduct);
router.get("/cart", getCart);
router.post("/cart", postCart);
router.delete("/cart/:id", deleteCart);
router.get("/orders", getOrders);
router.post("/create-order", postOrder);
router.get("/checkout", getCheckout);

module.exports = router;
