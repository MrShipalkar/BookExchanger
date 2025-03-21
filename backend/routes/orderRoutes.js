const express = require("express");
const router = express.Router();
const { createOrder, getOrdersBySeller, getOrdersByBuyer } = require("../controllers/orderController");

// POST: Create order
router.post("/create", createOrder);

// GET: Get orders by seller
router.get("/seller/:sellerId", getOrdersBySeller);

// GET: Get orders by buyer
router.get("/buyer/:buyerId", getOrdersByBuyer);

module.exports = router;
