import React from "react";
import "./SellerStats.css";

const SellerStats = () => {
    return (
        <div className="stats-container">
            <div className="stat-card">
                <h3>Total Sales</h3>
                <p>₹50,000</p>
            </div>
            <div className="stat-card">
                <h3>Books Listed</h3>
                <p>120</p>
            </div>
            <div className="stat-card">
                <h3>Orders Completed</h3>
                <p>95</p>
            </div>
        </div>
    );
};

export default SellerStats;
