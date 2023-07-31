const User = require("../models/userModel");

const getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.user,
  });
};

const postLogin = async (req, res, next) => {
  req.session.user = await User.findById("64bd5ec730b14b18a36cd2d1");
  res.redirect("/");
};

const postLogout = async (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err, "LOGOUT");
    res.redirect("/");
  });
};

module.exports = {
  getLogin,
  postLogin,
  postLogout,
};
