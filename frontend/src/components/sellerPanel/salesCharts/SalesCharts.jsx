import React from "react";
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


// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesCharts = () => {
    const data = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
            {
                label: "Sales ($)",
                data: [5000, 7000, 8000, 10000, 12000, 15000],
                backgroundColor: "rgba(231, 76, 60, 0.5)",
            },
        ],
    };

    return (
        <div className="sales-chart">
            <h2>Sales Performance</h2>
            <Bar data={data} />
        </div>
    );
};

export default SalesCharts;
