const express = require("express");
const router = express.Router();
const {
  getAddProduct,
  createProduct,
} = require("../controllers/productsContoller");

router.get("/add-product", getAddProduct);
router.post("/add-product", createProduct);
module.exports = router;
