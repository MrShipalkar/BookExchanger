const Order = require("../models/Order");
const Book = require("../models/Book");
const mongoose = require('mongoose');


// ✅ Fetch Seller Dashboard Stats
const getSellerDashboardStats = async (req, res) => {
    try {
        const sellerId = req.user.id;

        // ✅ Fetch Total Sales Count (All Completed Orders)
        const totalSales = await Order.countDocuments({ seller: sellerId });

        // ✅ Fetch Total Revenue
        const revenueData = await Order.aggregate([
            { $match: { seller: new mongoose.Types.ObjectId(sellerId), status: "Delivered" } },
            { $group: { _id: null, totalRevenue: { $sum: "$price" } } }
        ]);
        const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

        // ✅ Fetch Total Books Sold
        const booksSold = await Order.countDocuments({ seller: sellerId, status: "Delivered" });

        // ✅ Fetch Total Books Listed
        const totalBooksListed = await Book.countDocuments({ seller: sellerId });

        res.json({
            totalSales,
            totalRevenue,
            booksSold,
            totalBooksListed
        });
    } catch (error) {
        console.error("Error fetching seller stats:", error);
        res.status(500).json({ message: "Failed to fetch seller stats." });
    }
};


// ✅ Fetch Recent Orders for Dashboard
const getRecentOrders = async (req, res) => {
    try {
        const sellerId = req.user.id;

        // ✅ Find latest 5 orders by seller
        const orders = await Order.find({ seller: sellerId })
            .populate("book buyer")
            .sort({ createdAt: -1 }) // ✅ Sort by latest orders
            .limit(5);

        res.json(orders);
    } catch (error) {
        console.error("Error fetching recent orders:", error);
        res.status(500).json({ message: "Failed to fetch recent orders." });
    }
};


// ✅ Fetch Sales Data for Charts
const getSalesChartData = async (req, res) => {
    try {
        const sellerId = req.user.id;

        const salesData = await Order.aggregate([
            { $match: { seller: sellerId, status: "Delivered" } },
            {
                $group: {
                    _id: { $month: "$createdAt" }, // Group by month
                    totalSales: { $sum: "$totalPrice" },
                },
            },
            { $sort: { _id: 1 } }, // Sort by month
        ]);

        res.status(200).json(salesData);
    } catch (error) {
        console.error("Error fetching sales data:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getSellerDashboardStats, getRecentOrders, getSalesChartData };
