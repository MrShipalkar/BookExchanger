import api from "./apiConfig";

// 📌 Get Orders for the Seller (Fix API Path)
export const getSellerOrders = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.get("/orders/seller/orders", {
            headers: { "auth-token": token },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw new Error(error.response?.data?.message || "Failed to fetch orders.");
    }
};

// 📌 Update Order Status (Fix API Path)
export const updateOrderStatus = async (orderId, status) => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.put(`/orders/update-order/${orderId}`, { status }, {
            headers: { "auth-token": token },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating order:", error);
        throw new Error(error.response?.data?.message || "Failed to update order status.");
    }
};

// 📌Get Orders for the Buyer
export const getBuyerOrders = async () => {
    try {
        const token = localStorage.getItem("token"); // Get auth token
        const response = await api.get("/orders/buyer/orders", {
            headers: { "auth-token": token }, // Attach token manually
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching buyer orders:", error);
        throw new Error(error.response?.data?.message || "Failed to fetch orders.");
    }
};