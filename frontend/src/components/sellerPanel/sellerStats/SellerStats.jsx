import React, { useEffect, useState } from "react";
import "./SellerStats.css";
import { getSellerDashboardStats } from "../../../services/dashboardService";

const SellerStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await getSellerDashboardStats();
            setStats(response);
        } catch (error) {
            console.error("Error fetching seller stats:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="seller-stats-container">
            {loading ? (
                <p>Loading stats...</p>
            ) : stats ? (
                <div className="seller-stats">
                    <div className="stat-card">
                        <h3>Total Sales</h3>
                        <p>{stats.totalSales}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Revenue</h3>
                        <p>₹{stats.totalRevenue}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Books Sold</h3>
                        <p>{stats.booksSold}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Books Listed</h3>
                        <p>{stats.totalBooksListed}</p>
                    </div>
                </div>
            ) : (
                <p>Error loading stats</p>
            )}
        </div>
    );
};

export default SellerStats;
