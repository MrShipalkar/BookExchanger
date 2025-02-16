import api from "./apiConfig";

// ✅ Fetch Seller Profile
export const getSellerProfile = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.get("/seller/profile", {
            headers: { "auth-token": token },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching profile:", error);
        throw new Error(error.response?.data?.message || "Failed to fetch profile.");
    }
};

// ✅ Update Seller Profile
export const updateSellerProfile = async (profileData) => {
    try {
        const token = localStorage.getItem("token");

        const response = await api.put("/seller/profile", profileData, {
            headers: { "auth-token": token },
        });

        return response.data;
    } catch (error) {
        console.error("Error updating profile:", error);
        throw new Error(error.response?.data?.message || "Failed to update profile.");
    }
};


// ✅ Change Password
export const changeSellerPassword = async (passwordData) => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.put("/seller/change-password", passwordData, {
            headers: { "auth-token": token },
        });
        return response.data;
    } catch (error) {
        console.error("Error changing password:", error);
        throw new Error(error.response?.data?.message || "Failed to change password.");
    }
};

// ✅ Delete Account
export const deleteSellerAccount = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.delete("/seller/delete-account", {
            headers: { "auth-token": token },
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting account:", error);
        throw new Error(error.response?.data?.message || "Failed to delete account.");
    }
};
