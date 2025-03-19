import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/homepage/Homepage";
import Books from "./pages/books/Books";
import AboutUs from "./pages/about/AboutUs";
import SellerDashboard from "./pages/sellerPanel/dashBoard/Dashboard";
import ManageBooks from "./pages/sellerPanel/manageBooks/ManageBooks";
import Orders from "./pages/sellerPanel/orders/Orders";
import Reports from "./pages/sellerPanel/reports/Reports";
import Profile from "./pages/sellerPanel/profile/Profile";
import SellerSidebar from "./components/sellerPanel/sellerSidebar/SellerSidebar";
import BuyerDashboard from "./pages/buyerPanel/buyerDashboard/BuyerDashboard";
import ProductPage from "./pages/buyerPanel/productPage/ProductPage";
import BuyerNavbar from "./pages/buyerPanel/buyerNavbar/BuyerNavbar"; // ✅ Import Buyer Navbar
import MyOrders from "./pages/buyerPanel/myOrders/MyOrders";
import BuyerProfile from "./pages/buyerPanel/profile/Profile";

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Homepage />} />
                <Route path="/books" element={<Books />} />
                <Route path="/about" element={<AboutUs />} />

                {/* ✅ Fix: Update Buyer Routes to use "/buyer/*" */}
                <Route
                    path="/buyer/*"
                    element={
                        <div className="buyer-panel-container">
                            <BuyerNavbar /> {/* ✅ Buyer Navbar applied to all buyer pages */}
                            <div className="buyer-content">
                                <Routes>
                                    <Route path="Dashboard" element={<BuyerDashboard />} /> {/* ✅ Corrected Path */}
                                    <Route path="book/:bookId" element={<ProductPage />} />
                                    <Route path="orders" element={<MyOrders />} />
                                    <Route path="profile" element={<BuyerProfile />} />
                                </Routes>
                            </div>
                        </div>
                    }
                />

                {/* Seller Panel with Sidebar */}
                <Route
                    path="/seller/*"
                    element={
                        <div className="seller-panel-container">
                            <SellerSidebar />
                            <div className="seller-content">
                                <Routes>
                                    <Route path="dashboard" element={<SellerDashboard />} />
                                    <Route path="manage-books" element={<ManageBooks />} />
                                    <Route path="orders" element={<Orders />} />
                                    <Route path="reports" element={<Reports />} />
                                    <Route path="profile" element={<Profile />} />
                                </Routes>
                            </div>
                        </div>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
