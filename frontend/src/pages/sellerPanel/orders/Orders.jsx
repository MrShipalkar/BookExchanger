import React, { useState, useEffect } from "react";
import "./Orders.css";
import { FaTruck } from "react-icons/fa";
import { getSellerOrders, updateOrderStatus } from "../../../services/orderService";

const Orders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await getSellerOrders();
            setOrders(response);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const markAsShipped = async (id) => {
        try {
            await updateOrderStatus(id, "Shipped");
            setOrders(orders.map((order) => (order._id === id ? { ...order, status: "Shipped" } : order)));
        } catch (error) {
            console.error("Error updating order:", error);
        }
    };

    return (
        <div className="orders-container">
            <h2>Manage Orders</h2>

            {/* Orders Table */}
            <table className="orders-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Buyer</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.buyer ? order.buyer.name : "Unknown Buyer"}</td>
                                <td>₹{order.totalPrice}</td>
                                <td className={`status ${order.status.toLowerCase()}`}>{order.status}</td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td className="action-buttons">
                                    {order.status === "Pending" && (
                                        <button className="ship-btn" onClick={() => markAsShipped(order._id)}>
                                            <FaTruck /> Ship
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No orders found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Orders;
