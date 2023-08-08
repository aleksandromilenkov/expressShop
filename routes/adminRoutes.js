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
const multer = require("multer");
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

router.get("/add-product", protect, getAddProduct);
router.get("/edit-product/:id", protect, getEditProduct);
router.post(
  "/add-product",
  upload.single("image"),
  [
    body("title")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Title should be at least 2 characters long"),
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
  upload.single("image"),
  [
    body("title")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Title should be at least 2 characters long"),
    body("description").trim(),
    body("price").trim().isNumeric().withMessage("Price has to be in number"),
  ],
  protect,
  editProduct
);
module.exports = router;
