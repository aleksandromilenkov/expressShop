const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { validationResult } = require("express-validator");

const sendMail = async (to, from, subject, text, html) => {
  let testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  let message = {
    from: `${from}`,
    to: `${to}`,
    subjet: `${subject}`,
    text: `${text}`,
    html: `${html}`,
  };
  const resp = await transporter.sendMail(message);
  console.log(resp);
  return {
    message: "You received email",
    info: resp.messageId,
    preview: nodemailer.getTestMessageUrl(resp),
  };
};

const getLogin = (req, res, next) => {
  try {
    res.render("auth/login", {
      path: "/login",
      pageTitle: "Login",
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatus = 500;
    console.log(error);
    return next(error);
  }
};

const postLogin = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email: email });
    const errors = validationResult(req);
    console.log(errors.array());
    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: "error",
        message: errors.array()[0].msg,
        errors: errors.array(),
      });
    }
    if (!user) {
      console.log("Not user found with that E-mail");
      return res.status(401).json({
        status: "error",
        message: "Not user found with that E-mail ",
        errors: [{ path: "email" }],
      });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user?.password);
    if (!isPasswordCorrect) {
      console.log("Not user found with that Password");
      return res.status(401).json({
        status: "error",
        message: "Not user found with that Password",
        errors: [{ path: "password" }],
      });
    }
    req.session.isLoggedIn = true;
    req.session.user = user;
    req.session.save((err) => {
      err && console.log(err);
    });
    return res.status(200).json({
      status: "success",
      message: "User successfully logged in",
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatus = 500;
    console.log(error);
    return next(error);
  }
};

const postLogout = async (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err, "LOGOUT");
    res.redirect("/");
  });
};

const getSignup = async (req, res, next) => {
  try {
    res.render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      isAuthenticated: false,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatus = 500;
    console.log(error);
    return next(error);
  }
};

const postSignup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).json({
      status: "error",
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  // const isUserExists = await User.findOne({ email: email });
  // if (isUserExists) {
  //   return res.status(404).json({
  //     status: "error",
  //     message: "email already exists",
  //   });
  // }
  const user = await User.create({
    email: email,
    password: await bcrypt.hash(password, 12),
    cart: {
      items: [],
    },
  });
  await user.save();
  const sentEmail = await sendMail(
    email,
    "Aleksandro Milenkov aleksandromilenkov@yahoo.com",
    "Registered",
    "Successfully registered",
    `<b>Successfully registered.</b> You can login <a target='_blank' href='http://localhost:3000/login' > here </a>`
  );
  console.log(sentEmail);
  res.status(201).json({
    status: "success",
    user,
    sentEmail,
  });
};

const getReset = (req, res, next) => {
  try {
    res.render("auth/reset-password", {
      path: "/reset",
      pageTitle: "Reset Password",
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatus = 500;
    console.log(error);
    return next(error);
  }
};

const postReset = (req, res, next) => {
  crypto.randomBytes(32, async (error, buffer) => {
    if (error) {
      console.log(error);
      return res.redirect("/reset");
    }
    try {
      const token = buffer.toString("hex");
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(400).json({
          status: "error",
          message: "No account found with that e-mail",
        });
      }
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      await user.save();
      const sentEmail = await sendMail(
        req.body.email,
        "Aleksandro Milenkov express-shop@test.com",
        "Password Reset",
        "Password reset request",
        `
      <p>You requested a password reset </p>
      <p> Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password </p>
      `
      );
      console.log(sentEmail);
      res.status(201).json({
        status: "success",
        user,
        sentEmail,
      });
    } catch (err) {
      const error = new Error(err);
      error.httpStatus = 500;
      console.log(error);
      return next(error);
    }
  });
};

const getNewPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gte: Date.now() },
    });
    let errorMessage = null;
    if (!user) {
      errorMessage = "Password reset token expired. Try again.";
    }
    res.render(`auth/new-password`, {
      path: "/new-password",
      pageTitle: "New Password",
      errorMessage: errorMessage,
      token: token,
      userId: user?._id?.toString(),
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatus = 500;
    console.log(error);
    return next(error);
  }
};

const postNewPassword = async (req, res, next) => {
  try {
    const { newPassword, userId, token } = req.body;
    const user = await User.findOne({
      _id: userId,
      resetToken: token,
      resetTokenExpiration: { $gte: Date.now() },
    });
    user.password = await bcrypt.hash(newPassword, 12);
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Something went wrong, try again",
      });
    }
    res.status(200).json({
      status: "success",
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatus = 500;
    console.log(error);
    return next(error);
  }
};

const protect = async (req, res, next) => {
  if (!req.session?.isLoggedIn) {
    return res.redirect("/login");
  }
  next();
};

module.exports = {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
  getReset,
  postReset,
  getNewPassword,
  postNewPassword,
  protect,
};
