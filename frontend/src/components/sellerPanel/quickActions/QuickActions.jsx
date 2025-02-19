import React, { useState } from "react";
import "./QuickActions.css";
import AddBookModal from "../addBookModal/AddBookModal"; // Import modal

const QuickActions = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="quick-actions">
            <h3>Quick Actions</h3>
            <button className="btn-primary" onClick={() => setShowModal(true)}>➕ Add New Book</button>
            <button className="btn-secondary">📦 View Orders</button>
            <button className="btn-tertiary">📊 View Reports</button>

            {showModal && <AddBookModal onClose={() => setShowModal(false)} />} {/* Open modal */}
        </div>
    );
};

export default QuickActions;
