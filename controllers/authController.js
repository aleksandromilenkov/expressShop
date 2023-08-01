const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

const getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
  });
};

const postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await User.findOne({ email: email });
  if (!user) {
    console.log("Not user found with that E-mail");
    return res.status(401).json({
      status: "error",
      message: "Not user found with that E-mail ",
    });
  }
  const isPasswordCorrect = await bcrypt.compare(password, user?.password);
  if (!isPasswordCorrect) {
    console.log("Not user found with that Password");
    return res.status(401).json({
      status: "error",
      message: "Not user found with that Password",
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
};

const postLogout = async (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err, "LOGOUT");
    res.redirect("/");
  });
};

const getSignup = async (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
  });
};

const postSignup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const isUserExists = await User.findOne({ email: email });
  if (isUserExists) {
    return res.status(404).json({
      status: "error",
      message: "user already exists",
    });
  }
  const user = await User.create({
    email: email,
    password: await bcrypt.hash(password, 12),
    cart: {
      items: [],
    },
  });
  await user.save();
  res.status(201).json({
    status: "success",
    user,
  });
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
  protect,
};
