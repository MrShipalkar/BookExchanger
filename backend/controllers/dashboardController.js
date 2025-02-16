const Order = require("../models/Order");
const Book = require("../models/Book");

// ✅ Fetch Seller Dashboard Stats
const getSellerDashboardStats = async (req, res) => {
    try {
        const sellerId = req.user.id;

        // Total Sales Count
        const totalSales = await Order.countDocuments({ seller: sellerId, status: "Delivered" });

        // Total Revenue
        const totalRevenue = await Order.aggregate([
            { $match: { seller: sellerId, status: "Delivered" } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } },
        ]);

        // Total Books Sold
        const booksSold = await Order.aggregate([
            { $match: { seller: sellerId, status: "Delivered" } },
            { $unwind: "$books" },
            { $group: { _id: null, totalSold: { $sum: "$books.quantity" } } },
        ]);

        // Total Books Listed
        const totalBooksListed = await Book.countDocuments({ seller: sellerId });

        res.status(200).json({
            totalSales,
            totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
            booksSold: booksSold.length > 0 ? booksSold[0].totalSold : 0,
            totalBooksListed,
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Fetch Recent Orders for Dashboard
const getRecentOrders = async (req, res) => {
    try {
        const sellerId = req.user.id;

        const recentOrders = await Order.find({ seller: sellerId })
            .sort({ createdAt: -1 }) // Sort by most recent
            .limit(5) // Get last 5 orders
            .populate("buyer", "name")
            .populate("books.book", "title");

        res.status(200).json(recentOrders);
    } catch (error) {
        console.error("Error fetching recent orders:", error);
        res.status(500).json({ message: "Server error" });
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
