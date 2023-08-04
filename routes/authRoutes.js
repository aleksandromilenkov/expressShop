const express = require("express");
const authController = require("../controllers/authController");
const { check, body } = require("express-validator");
const User = require("../models/userModel");

const router = express.Router();

router.get("/login", authController.getLogin);
router.post(
  "/login",
  [
    check("email").isEmail().withMessage("Please enter a valid e-mail"),
    body(
      "password",
      "Please enter at least 5 characters long alphanumeric password"
    )
      .isLength({ min: 5, max: 20 })
      .isAlphanumeric(),
  ],
  authController.postLogin
);
router.post("/logout", authController.postLogout);
router.get("/signup", authController.getSignup);
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid e-mail address")
      .custom((value, { req }) => {
        const regex = /express-shop@[\s\S]*/;
        const isCorrect = regex.exec(value);
        if (isCorrect) {
          throw new Error("This e-mail name is forbidden");
        }
        return true;
      })
      .custom(async (value, { req }) => {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject("E-mail already exists");
        }
        return true;
      }),
    body(
      "password",
      "Please enter at least 5 characters long alphanumeric password"
    )
      .isLength({ min: 5, max: 20 })
      .isAlphanumeric(),
    body("confirmPassword").custom((value, { req }) => {
      const password = req.body.password;
      if (value !== password) {
        throw new Error("Please confirm your password correctly");
      }
      return true;
    }),
  ],
  authController.postSignup
);
router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);
router.get("/reset/:token", authController.getNewPassword);
router.post("/reset/:token", authController.postNewPassword);

module.exports = router;
