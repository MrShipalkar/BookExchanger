import api from "./apiConfig";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token"); // ✅ Ensure we use the correct token key
    if (!token) throw new Error("No auth token found. Please log in.");
    return { headers: { "auth-token": token } }; // ✅ Ensure backend expects "auth-token"
};

export const getSalesReport = async (range) => {
    try {
        const response = await api.get(`/seller/reports/sales?range=${range}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error fetching sales report:", error.response?.data || error.message);
        throw new Error("Failed to fetch sales report.");
    }
};

export const getBestSellingBooks = async () => {
    try {
        const response = await api.get("/seller/reports/best-sellers", getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error fetching best-selling books:", error.response?.data || error.message);
        throw new Error("Failed to fetch best-selling books.");
    }
};

export const getOrderSummary = async (range) => {
    try {
        const response = await api.get(`/seller/reports/orders-summary?range=${range}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error fetching order summary:", error.response?.data || error.message);
        throw new Error("Failed to fetch order summary.");
    }
};
