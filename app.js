const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const adminRoutes = require("./routes/adminRoutes");
const shopRoutes = require("./routes/shopRoutes");
const { errorHandler } = require("./controllers/errorController");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "10kb" }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/admin", adminRoutes);
app.use("/", shopRoutes);

app.use("*", errorHandler);

app.listen(3000, () => console.log("Server started at port 3000"));
