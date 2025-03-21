const Order = require("../models/Order");

const createOrder = async (req, res) => {
    try {
        const {
            chatId,
            buyerId,
            sellerId,
            bookId,
            deliveryAddress,
            phoneNumber,
            price,
            orderType,
            rentDays,
            rentStartDate,
            rentEndDate
        } = req.body;

        console.log("Incoming Order Data:", {
            rentStartDate,
            rentEndDate,
            rentDays
        });

        const order = new Order({
            chat: chatId,
            buyer: buyerId,
            seller: sellerId,
            book: bookId,
            deliveryAddress,
            phoneNumber,
            price,
            orderType,
            rentDays,
            rentStartDate,
            rentEndDate
        });

        const savedOrder = await order.save();
        console.log("Saved Order Data:", savedOrder);

        // ✅ Ensure Socket.IO is attached to the app
        const io = req.app.get("io");

        if (!io) {
            console.error("Socket.IO instance is not available.");
            return res.status(500).json({ message: "Internal server error: Socket.IO not initialized" });
        }

        // ✅ Format Rent Dates Properly
        const formattedRentStartDate = savedOrder.rentStartDate
            ? new Date(savedOrder.rentStartDate).toLocaleDateString("en-IN")
            : "N/A";

        const formattedRentEndDate = savedOrder.rentEndDate
            ? new Date(savedOrder.rentEndDate).toLocaleDateString("en-IN")
            : "N/A";

        console.log("Formatted Rent Start Date:", formattedRentStartDate);
        console.log("Formatted Rent End Date:", formattedRentEndDate);

        // ✅ Emit order confirmation message to the chat room with **proper line breaks**
        io.to(chatId).emit("receive_message", {
            chatId,
            sender: "System",
            senderModel: "System",
            message: `✅ **Order Placed Successfully!**\n\n`
                + `📚 **Book:** ${bookId}\n`
                + `📖 **Type:** ${orderType === "rent" ? `📅 Rent (${rentDays} days)` : "🛍 Purchase"}\n`
                + `🗓 **Rent Period:** ${orderType === "rent" ? `${formattedRentStartDate} to ${formattedRentEndDate}` : "N/A"}\n`
                + `💰 **Price:** ₹${price}\n`
                + `🚚 **Delivery Address:** ${deliveryAddress}\n`
                + `📞 **Phone:** ${phoneNumber}`
        });

        res.status(201).json(savedOrder);
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: "Failed to create order" });
    }
};





const getOrdersBySeller = async (req, res) => {
    try {
        const sellerId = req.params.sellerId;
        const orders = await Order.find({ seller: sellerId }).populate("book buyer chat");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders" });
    }
};

const getOrdersByBuyer = async (req, res) => {
    try {
        const buyerId = req.params.buyerId;
        const orders = await Order.find({ buyer: buyerId }).populate("book seller chat");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders" });
    }
};

module.exports = {
    createOrder,
    getOrdersBySeller,
    getOrdersByBuyer
};
