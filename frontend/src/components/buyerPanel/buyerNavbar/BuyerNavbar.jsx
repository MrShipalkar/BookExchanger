import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./BuyerNavbar.css";

const BuyerNavbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            <nav className="buyer-navbar">
                {/* Logo Section */}
                <div className="buyer-navbar-logo">
                    <Link to="/buyer/dashboard">
                        <span className="navbar-title">Book<span className="highlight">X</span>changer</span>
                    </Link>
                </div>

                {/* Hamburger Menu for Mobile */}
                <div className="buyer-hamburger" onClick={toggleMenu}>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </div>

                {/* Navigation Links */}
                <ul className={`buyer-navbar-links ${isMenuOpen ? "active" : ""}`}>
                    <li><Link to="/buyer/dashboard">Home</Link></li>
                    <li><Link to="/buyer/orders">My Orders</Link></li>
                    <li><Link to="/buyer/wishlist">Wishlist</Link></li>
                    <li><Link to="/buyer/profile">Profile</Link></li>
                    <li><Link to="/logout">Logout</Link></li>
                </ul>
            </nav>
        </>
    );
};

export default BuyerNavbar;
