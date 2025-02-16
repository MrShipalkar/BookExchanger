const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware");
const {
    getOrdersBySeller,
    updateOrderStatus,
} = require("../controllers/orderController");

const router = express.Router();

// ✅ Get orders for seller
router.get("/seller/orders", verifyToken, getOrdersBySeller);

// ✅ Update order status
router.put("/update-order/:id", verifyToken, updateOrderStatus);

module.exports = router;
