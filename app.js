const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const adminRoutes = require("./routes/adminRoutes");
const shopRoutes = require("./routes/shopRoutes");
const authRoutes = require("./routes/auth");
const dotenv = require("dotenv");
const { errorHandler } = require("./controllers/errorController");
const User = require("./models/userModel");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const store = new MongoDBStore({
  uri: "mongodb+srv://aleksandro:gzF2lzgI0EYtTF4b@cluster0.41krbbu.mongodb.net/express-shop?retryWrites=true&w=majority",
  collection: "sessions",
});
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

app.use((req, res, next) => {
  User.findById("64bd5ec730b14b18a36cd2d1")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
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
    User.findOne().then((user) => {
      if (!user) {
        const newUser = new User({
          name: "Max",
          email: "max@yahoo.com",
          cart: {
            items: [],
          },
        });
        newUser.save();
      }
    });
    app.listen(3000, () => console.log("Server started at port 3000"));
  })
  .catch((err) => console.log(err));
