const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const adminRoutes = require("./routes/adminRoutes");
const shopRoutes = require("./routes/shopRoutes");
const authRoutes = require("./routes/authRoutes");
const dotenv = require("dotenv");
const { errorHandler } = require("./controllers/errorController");
const User = require("./models/userModel");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csurf = require("csurf");

const store = new MongoDBStore({
  uri: "mongodb+srv://aleksandro:gzF2lzgI0EYtTF4b@cluster0.41krbbu.mongodb.net/express-shop?retryWrites=true&w=majority",
  collection: "sessions",
});
const csurfProtection = csurf();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "10kb" }));
app.use(bodyParser.urlencoded({ extended: false }));
dotenv.config({ path: "./config.env" });
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(csurfProtection);

app.use(async (req, res, next) => {
  try {
    const user = await User.findById(req.session?.user?._id);
    req.user = user;
    next();
  } catch (err) {
    console.log(err, "NO USER LOGGED IN");
  }
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session?.isLoggedIn;
  res.locals.csurfToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoutes);
app.use("/", shopRoutes);
app.use("/", authRoutes);

app.use("*", errorHandler);

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB)
  .then(() => {
    console.log("connected to db");
    app.listen(3000, () => console.log("Server started at port 3000"));
  })
  .catch((err) => console.log(err));
