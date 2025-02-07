import React, { useState } from "react";
import "./Reports.css";
import { Line, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// Register chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Reports = () => {
    const [dateRange, setDateRange] = useState("monthly");

    // Dummy Data for Charts
    const salesData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
            {
                label: "Sales Revenue ($)",
                data: [4000, 7000, 5000, 9000, 12000, 15000],
                backgroundColor: "rgba(231, 76, 60, 0.5)",
                borderColor: "#E74C3C",
                borderWidth: 1,
            },
        ],
    };

    const orderSummaryData = {
        labels: ["Completed", "Pending", "Cancelled"],
        datasets: [
            {
                data: [45, 10, 5],
                backgroundColor: ["#2ECC71", "#F1C40F", "#E74C3C"],
            },
        ],
    };

    const bestSellingBooks = [
        { title: "Atomic Habits", sales: 120, revenue: "$2,400" },
        { title: "The Psychology of Money", sales: 90, revenue: "$1,800" },
        { title: "Rich Dad Poor Dad", sales: 80, revenue: "$1,600" },
    ];

    return (
        <div className="reports-container">
            <h2>📊 Sales & Reports</h2>

            {/* Date Range Selector */}
            <div className="date-range">
                <label>Select Date Range:</label>
                <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
            </div>

            {/* Charts Row - Two Charts Stay Side by Side */}
            <div className="charts-row">
                <div className="chart-container">
                    <h3>📈 Sales Performance</h3>
                    <Line data={salesData} />
                </div>

                <div className="chart-container">
                    <h3>📦 Order Summary</h3>
                    <Pie data={orderSummaryData} />
                </div>
            </div>

            {/* Best-Selling Books */}
            <div className="best-sellers">
                <h3>🏆 Best-Selling Books</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Book Title</th>
                            <th>Sales</th>
                            <th>Revenue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bestSellingBooks.map((book, index) => (
                            <tr key={index}>
                                <td>{book.title}</td>
                                <td>{book.sales}</td>
                                <td>{book.revenue}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Export Button */}
            <div className="export-report">
                <button>📄 Download Report</button>
            </div>
        </div>
    );
};

export default Reports;
