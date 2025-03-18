import React from "react";
import "./LogoutModal.css";

const LogoutModal = ({ isOpen, onClose, onLogout }) => {
    if (!isOpen) return null;

    return (
        <div className="logout-modal">
            <div className="logout-content">
                <h2>Confirm Logout</h2>
                <p>Are you sure you want to log out?</p>
                <div className="logout-buttons">
                    <button className="logout-confirm" onClick={onLogout}>Yes, Logout</button>
                    <button className="logout-cancel" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;
