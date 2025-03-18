import React, { useEffect, useState } from "react";
import { getBuyerOrders } from "../../../services/orderService"; // Fetch buyer orders
import "./MyOrders.css";

const MyOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getBuyerOrders();
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };
        fetchOrders();
    }, []);

    return (
        <div className="my-orders">
            <h2>My Orders</h2>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order._id} className="order-card">
                            <h3>Order ID: {order._id}</h3>
                            <p>Book: {order.bookTitle}</p>
                            <p>Price: ₹{order.price}</p>
                            <p>Status: {order.status}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
