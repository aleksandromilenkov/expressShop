const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const adminRoutes = require("./routes/adminRoutes");
const shopRoutes = require("./routes/shopRoutes");
const dotenv = require("dotenv");
const { errorHandler } = require("./controllers/errorController");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "10kb" }));
app.use(bodyParser.urlencoded({ extended: false }));
dotenv.config({ path: "./config.env" });

app.use("/admin", adminRoutes);
app.use("/", shopRoutes);

app.use("*", errorHandler);

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB).then(() => {
  console.log("connected to db");
});

app.listen(3000, () => console.log("Server started at port 3000"));
