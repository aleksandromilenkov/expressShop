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

router.get("/add-product", getAddProduct);
router.get("/edit-product/:id", getEditProduct);
router.post("/add-product", createProduct);
router.get("/products", getProducts);
router.delete("/products/:id", deleteProduct);
router.patch("/products/:id", editProduct);
module.exports = router;
