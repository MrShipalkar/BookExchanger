import React from "react";
import "./RecentOrders.css";

const RecentOrders = () => {
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
                    <tr>
                        <td>Atomic Habits</td>
                        <td>₹299</td>
                        <td>✅ Delivered</td>
                    </tr>
                    <tr>
                        <td>Rich Dad Poor Dad</td>
                        <td>₹399</td>
                        <td>🚚 Shipped</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default RecentOrders;
