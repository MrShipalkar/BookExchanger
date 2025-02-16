const express = require("express");
const { getSalesReport, getBestSellingBooks } = require("../controllers/reportController");
const { verifyToken } = require("../middlewares/authMiddleware"); // ✅ Ensure correct path

const router = express.Router();

// 🟢 Requires authentication (verifyToken)
router.get("/sales", verifyToken, getSalesReport);
router.get("/best-sellers", verifyToken, getBestSellingBooks);

module.exports = router;
