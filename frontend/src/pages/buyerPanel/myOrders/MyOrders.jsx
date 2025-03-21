import React, { useEffect, useState } from "react";
import { getBuyerOrders } from "../../../services/orderService";
import BuyerChatModal from "../chats/BuyerChatModal";
import "./MyOrders.css";

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedChatId, setSelectedChatId] = useState(null); // ✅ State to open chat modal

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getBuyerOrders();
                if (response && Array.isArray(response)) {
                    setOrders(response);
                } else {
                    setOrders([]);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
                setError("Failed to load orders. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    return (
        <div className="my-orders">
            {/* <h2>📦 My Orders</h2> */}

            {loading ? (
                <p>Loading orders...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <div className="orders-grid">
                    {orders.map((order) => (
                        <div key={order._id} className="order-card">
                            {/* ✅ Book Image */}
                            <img
                                src={order.book?.images?.[0] || "/placeholder.png"}
                                alt={order.book?.title || "Book Image"}
                                className="book-image"
                            />

                            <h3>📌 Order ID: {order._id.slice(-6).toUpperCase()}</h3>
                            <p>📚 <strong>Book:</strong> {order.book ? order.book.title : "Unknown"}</p>
                            <p>📖 <strong>Book Type:</strong> {order.book ? order.book.bookType : "N/A"}</p>
                            <p>🛒 <strong>Order Type:</strong> {order.orderType === "rent" ? "Rent" : "Purchase"}</p>

                            {order.orderType === "rent" && (
                                <p>🗓 <strong>Rent Period:</strong> {new Date(order.rentStartDate).toLocaleDateString()} - {new Date(order.rentEndDate).toLocaleDateString()}</p>
                            )}

                            <p>💰 <strong>Price:</strong> ₹{order.price}</p>
                            <p>🚚 <strong>Delivery Address:</strong> {order.deliveryAddress}</p>
                            <p>📞 <strong>Phone:</strong> {order.phoneNumber}</p>
                            <p className={`status ${order.status.toLowerCase()}`}>
                                🔹 <strong>Status:</strong> {order.status}
                            </p>

                            {/* ✅ Check Order Chat Button */}
                            <button className="chat-btn" onClick={() => setSelectedChatId(order.chat?._id)}>
                                💬 Check Order Chat
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* ✅ Open Chat Modal if a chat is selected */}
            {selectedChatId && (
                <BuyerChatModal chatId={selectedChatId} onClose={() => setSelectedChatId(null)} />
            )}
        </div>
    );
};

export default MyOrders;
