import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import "./SalesCharts.css";
import { getSalesChartData } from "../../../services/dashboardService";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesCharts = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: "Sales (₹)",
                data: [],
                backgroundColor: "rgba(231, 76, 60, 0.5)",
            },
        ],
    });

    useEffect(() => {
        fetchChartData();
    }, []);

    const fetchChartData = async () => {
        try {
            const response = await getSalesChartData();

            // Convert backend data to Chart.js format
            const labels = response.map((item) => getMonthName(item._id));
            const salesData = response.map((item) => item.totalSales);

            setChartData({
                labels,
                datasets: [
                    {
                        label: "Sales (₹)",
                        data: salesData,
                        backgroundColor: "rgba(231, 76, 60, 0.5)",
                    },
                ],
            });
        } catch (error) {
            console.error("Error fetching sales chart data:", error);
        }
    };

    // ✅ Convert month number (1-12) to month name
    const getMonthName = (monthNumber) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return months[monthNumber - 1] || "Unknown";
    };

    return (
        <div className="sales-chart">
            <h2>Sales Performance</h2>
            <Bar data={chartData} />
        </div>
    );
};

export default SalesCharts;
