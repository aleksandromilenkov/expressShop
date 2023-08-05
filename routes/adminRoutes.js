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
const { check, body } = require("express-validator");

router.get("/add-product", protect, getAddProduct);
router.get("/edit-product/:id", protect, getEditProduct);
router.post(
  "/add-product",
  [
    body("title")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Title should be at least 2 characters long"),
    body("imageUrl").trim().isURL().withMessage("Please enter a valid URL"),
    body("description").trim(),
    body("price").trim().isNumeric().withMessage("Price has to be in number"),
  ],
  protect,
  createProduct
);
router.get("/products", protect, getProducts);
router.delete("/products/:id", protect, deleteProduct);
router.patch(
  "/products/:id",
  [
    body("title")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Title should be at least 2 characters long"),
    body("imageUrl").trim().isURL().withMessage("Please enter a valid URL"),
    body("description").trim(),
    body("price").trim().isNumeric().withMessage("Price has to be in number"),
  ],
  protect,
  editProduct
);
module.exports = router;
