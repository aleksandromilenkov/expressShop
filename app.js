const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const adminRoutes = require("./routes/adminRoutes");
const shopRoutes = require("./routes/shopRoutes");
const authRoutes = require("./routes/authRoutes");
const dotenv = require("dotenv");
const {
  errorHandler,
  errorHandlerInternal,
} = require("./controllers/errorController");
const User = require("./models/userModel");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csurf = require("csurf");
const multer = require("multer");

const store = new MongoDBStore({
  uri: "mongodb+srv://aleksandro:gzF2lzgI0EYtTF4b@cluster0.41krbbu.mongodb.net/express-shop?retryWrites=true&w=majority",
  collection: "sessions",
});
// Protect XSS Attacks with csurf:
const csurfProtection = csurf();

// Set the view engine to EJS:
app.set("view engine", "ejs");

// Describe where the views folder is located:
app.set("views", path.join(__dirname, "views"));

// Describe where the public folder is located:
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "images")));

// Accept json files through body:
app.use(express.json({ limit: "10kb" }));

// Accept text files through body:
app.use(bodyParser.urlencoded({ extended: false }));

// Describe where is the config file:
dotenv.config({ path: "./config.env" });

// Middleware for storing the session for loged in users:
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// Invoke the XSS protection:
app.use(csurfProtection);

// Middleware to set local variables for loged in user and the XSS token
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session?.isLoggedIn;
  res.locals.csurfToken = req.csrfToken();
  next();
});

// Middleware for store the loged in user in the request as User Model:
app.use(async (req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  try {
    const user = await User.findById(req.session?.user?._id);
    req.user = user;
    next();
  } catch (err) {
    console.log(err, "NO USER LOGGED IN");
    next(new Error(err));
  }
});

// ROUTES:
app.use("/admin", adminRoutes);
app.use("/", shopRoutes);
app.use("/", authRoutes);

// Handling Server Internal Error route:
app.get("/500", errorHandlerInternal);

// This will execute for every route (Catch the error):
app.use(errorHandler);

// Built in middleware for catching the error of any type:
app.use((error, req, res, next) => {
  res.status(500).render("500", {
    pageTitle: "Internal Server Error ",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
});

// Reading the database and password from .env file:
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

// Connecting to the database and starting the server:
mongoose
  .connect(DB)
  .then(() => {
    console.log("connected to db");
    app.listen(3000, () => console.log("Server started at port 3000"));
  })
  .catch((err) => console.log(err));
