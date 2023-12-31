const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: Object,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    user: {
      email: {
        type: String,
        required: true,
      },
      userId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User",
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
