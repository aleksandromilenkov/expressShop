const express = require("express");
const router = express.Router();
const {
  getAddProduct,
  getEditProduct,
  createProduct,
  getProducts,
  editProduct,
  deleteProduct,
} = require("../controllers/adminController");
const { protect } = require("../controllers/authController");

router.get("/add-product", protect, getAddProduct);
router.get("/edit-product/:id", protect, getEditProduct);
router.post("/add-product", protect, createProduct);
router.get("/products", protect, getProducts);
router.delete("/products/:id", protect, deleteProduct);
router.patch("/products/:id", protect, editProduct);
module.exports = router;
