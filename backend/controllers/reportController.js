const Order = require("../models/Order");
const Book = require("../models/Book");

exports.getSalesReport = async (req, res) => {
    try {
        const sellerId = req.user?.id || req.user?._id;

        const { range } = req.query;

        console.log("📥 Seller ID:", sellerId);
        console.log("📆 Date Range:", range);

        let dateFilter = {};
        const now = new Date();

        if (range === "monthly") {
            dateFilter = { createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) } };
        } else if (range === "yearly") {
            dateFilter = { createdAt: { $gte: new Date(now.getFullYear(), 0, 1) } };
        }

        const orders = await Order.find({ 
            seller: sellerId, 
            ...dateFilter, 
            status: "Delivered" 
        });
        console.log("🧪 Seller ID:", sellerId);

const debugOrders = await Order.find({}); // Fetch all orders
console.log("🧪 Sample Order:", debugOrders[0]);


        console.log("📦 Orders found:", orders.length);

        const totalSales = orders.reduce((sum, order) => sum + order.price, 0);

        res.json({ totalSales, ordersCount: orders.length });
    } catch (error) {
        console.error("❌ Error in getSalesReport:", error);
        res.status(500).json({
            message: "Error fetching sales report",
            error: error.message || error
        });
    }
};



exports.getBestSellingBooks = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const books = await Book.find({ sellerId }).sort({ sales: -1 }).limit(5);

        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "Error fetching best-selling books", error });
    }
};
