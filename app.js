const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const adminData = require("./routes/adminRoutes");
const shopRoutes = require("./routes/shopRoutes");
const rootDir = require("./utils/path");

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "10kb" }));
app.use(bodyParser.urlencoded({ extended: false }));
const products = adminData.products;
app.use("/admin", adminData.router);
app.use((req, res, next) => {
  req.products = products;
  next();
}, shopRoutes);

app.use("*", (req, res) => {
  res.status(404).sendFile(path.join(rootDir, "views", "404.html"));
});

app.listen(3000, () => console.log("Server started at port 3000"));
