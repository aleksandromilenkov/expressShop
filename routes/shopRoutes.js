const express = require("express");
const path = require("path");
const router = express.Router();
const rootDir = require("../utils/path");

router.get("/", (req, res, next) => {
  console.log(req.products);
  res.render("shop", {
    products: req.products,
  });
});

module.exports = router;
