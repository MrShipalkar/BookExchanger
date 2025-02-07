import React, { useState, useEffect } from "react";
import "./Orders.css";
import { FaTruck, FaEye } from "react-icons/fa"; // Import icons

const Orders = () => {
    const [orders, setOrders] = useState([
        {
            _id: "1",
            buyer: "John Doe",
            totalAmount: 50,
            status: "Pending",
            date: "2024-02-07",
        },
        {
            _id: "2",
            buyer: "Jane Smith",
            totalAmount: 30,
            status: "Shipped",
            date: "2024-02-06",
        },
        {
            _id: "3",
            buyer: "Alice Brown",
            totalAmount: 75,
            status: "Delivered",
            date: "2024-02-05",
        },
    ]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        // Fetch orders from API (Replace with real API call later)
        console.log("Fetching orders...");
    };

    const markAsShipped = (id) => {
        console.log("Marking order as shipped:", id);
        setOrders(orders.map(order =>
            order._id === id ? { ...order, status: "Shipped" } : order
        ));
    };

    const viewDetails = (id) => {
        console.log("Viewing details for order:", id);
        // Add logic to show order details
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
                    {orders.map((order) => (
                        <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>{order.buyer}</td>
                            <td>${order.totalAmount}</td>
                            <td className={`status ${order.status.toLowerCase()}`}>{order.status}</td>
                            <td>{order.date}</td>
                            <td className="action-buttons">
                                {order.status === "Pending" && (
                                    <button className="ship-btn" onClick={() => markAsShipped(order._id)}>
                                        <FaTruck /> Ship
                                    </button>
                                )}
                                <button className="view-btn" onClick={() => viewDetails(order._id)}>
                                    <FaEye /> View
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Orders;
