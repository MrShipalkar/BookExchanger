const Order = require("../models/Order");

// ✅ Get all orders for a seller
const getOrdersBySeller = async (req, res) => {
    try {
        const orders = await Order.find({ seller: req.user.id })
            .populate("buyer", "name email")
            .populate("books.book", "title price");

        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Update Order Status
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findById(id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        if (order.seller.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        order.status = status;
        await order.save();

        res.status(200).json({ message: "Order status updated", order });
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getOrdersBySeller, updateOrderStatus };
