const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware");
const {
    getOrdersBySeller,
    updateOrderStatus,
    getBuyerOrders
} = require("../controllers/orderController");

const router = express.Router();

// ✅ Get orders for seller
router.get("/seller/orders", verifyToken, getOrdersBySeller);

// ✅ Update order status
router.put("/update-order/:id", verifyToken, updateOrderStatus);

//  ✅ Get orders for Buyer
router.get("/buyer/orders", verifyToken, getBuyerOrders);
module.exports = router;
