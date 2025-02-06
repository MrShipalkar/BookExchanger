import React from "react";
import "./QuickActions.css";

const QuickActions = () => {
    return (
        <div className="quick-actions">
            <h3>Quick Actions</h3>
            <button className="btn-primary">➕ Add New Book</button>
            <button className="btn-secondary">📦 View Orders</button>
            <button className="btn-tertiary">📊 View Reports</button>
        </div>
    );
};

export default QuickActions;
