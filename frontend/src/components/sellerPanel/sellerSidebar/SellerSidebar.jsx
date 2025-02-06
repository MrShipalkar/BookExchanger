import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./SellerSidebar.css";

const SellerSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation(); // Detects route changes

    // Close sidebar when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    return (
        <>
            {/* Mobile Navbar */}
            <div className="mobile-navbar">
                <div className="logo">
                    Book<span className="highlight">X</span>changer
                </div>
                <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? "✖" : "☰"}
                </button>
            </div>

            {/* Sidebar for Desktop and Mobile */}
            <aside className={`seller-sidebar ${isOpen ? "open" : ""}`}>
                {/* Desktop Logo */}
                <div className="sidebar-logo">
                    Book<span className="highlight">X</span>changer
                </div>
                <ul>
                    <li><NavLink to="/seller/dashboard" activeclassname="active" onClick={() => setIsOpen(false)}>Dashboard</NavLink></li>
                    <li><NavLink to="/seller/manage-books" activeclassname="active" onClick={() => setIsOpen(false)}>Manage Books</NavLink></li>
                    <li><NavLink to="/seller/orders" activeclassname="active" onClick={() => setIsOpen(false)}>Orders</NavLink></li>
                    <li><NavLink to="/seller/reports" activeclassname="active" onClick={() => setIsOpen(false)}>Reports</NavLink></li>
                    <li><NavLink to="/seller/profile" activeclassname="active" onClick={() => setIsOpen(false)}>Profile</NavLink></li>
                </ul>
            </aside>
        </>
    );
};

export default SellerSidebar;
