import React, { useEffect, useState } from "react";
import "./RecentOrders.css";
import { getRecentOrders } from "../../../services/dashboardService";

const RecentOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await getRecentOrders();
            setOrders(response);
        } catch (error) {
            console.error("Error fetching recent orders:", error);
        }
    };

    return (
        <div className="recent-orders">
            <h3>Recent Orders</h3>
            <table>
                <thead>
                    <tr>
                        <th>Book</th>
                        <th>Price</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? (
                        orders.map((order) =>
                            order.books.map((bookItem, index) => (
                                <tr key={`${order._id}-${index}`}>
                                    <td>{bookItem.book?.title || "Unknown Book"}</td>
                                    <td>₹{bookItem.book?.price || "N/A"}</td>
                                    <td>{getOrderStatusIcon(order.status)}</td>
                                </tr>
                            ))
                        )
                    ) : (
                        <tr>
                            <td colSpan="3">No recent orders found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

// ✅ Convert Order Status into Icons
const getOrderStatusIcon = (status) => {
    switch (status) {
        case "Pending":
            return "⏳ Pending";
        case "Processing":
            return "🔄 Processing";
        case "Shipped":
            return "🚚 Shipped";
        case "Delivered":
            return "✅ Delivered";
        case "Cancelled":
            return "❌ Cancelled";
        default:
            return "Unknown";
    }
};

export default RecentOrders;
