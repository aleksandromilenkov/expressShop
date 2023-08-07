const errorHandler = (req, res) => {
  res.status(404).render("404", {
    pageTitle: "Page Not Found ",
    path: "/404",
    isAuthenticated: req.session.isLoggedIn,
  });
};

const errorHandlerInternal = (req, res) => {
  res.status(500).render("500", {
    pageTitle: "Internal Server Error ",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
};

module.exports = {
  errorHandler,
  errorHandlerInternal,
};
