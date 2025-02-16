const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "Buyer", required: true },
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Shipped", "Delivered"], default: "Pending" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
