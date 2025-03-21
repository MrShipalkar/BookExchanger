import axios from "./apiConfig";

// ✅ Start a chat (Buyer Only)
export const startChat = async (data) => {
    try {
        const response = await axios.post("/chats/start", data, {
            headers: { "auth-token": localStorage.getItem("token") }
        });
        return response.data;
    } catch (error) {
        console.error("Error starting chat:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to start chat.");
    }
};

// // ✅ Get all chats for a user (Both Buyer & Seller)
// export const getAllChats = async () => {
//     try {
//         const response = await axios.get("/chats/", {
//             headers: { "auth-token": localStorage.getItem("token") }
//         });
//         return response.data;
//     } catch (error) {
//         console.error("Error fetching chats:", error.response?.data || error.message);
//         throw new Error(error.response?.data?.message || "Failed to fetch chats.");
//     }
// };

// // ✅ Fetch a specific chat by its ID
// export const getChatById = async (chatId) => {
//     try {
//         const response = await axios.get(`/chat/${chatId}`);
//         return response.data;
//     } catch (error) {
//         console.error("Error fetching chat:", error.response?.data || error.message);
//         throw new Error(error.response?.data?.message || "Failed to fetch chat.");
//     }
// };

// ✅ Ensure all functions are properly exported
export const getAllChats = async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token not found");

        console.log("Fetching seller chats with token:", token); // ✅ Debugging log

        const response = await axios.get("/chats/", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log("Seller Chats API Response:", response.data); // ✅ Debugging log
        return response.data;
    } catch (error) {
        console.error("Error fetching chats:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch chats.");
    }
};



// ✅ Get messages for a specific chat
export const getChat = async (chatId) => {
    try {
        const response = await axios.get(`/chats/${chatId}`, {
            headers: { "auth-token": localStorage.getItem("token") }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching chat messages:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch chat messages.");
    }
};

// ✅ Send a message (Both Buyer & Seller)
export const sendMessage = async (chatId, message) => {
    try {
        const userId = localStorage.getItem("userId"); // ✅ Get current user ID
        const userRole = localStorage.getItem("userRole"); // ✅ Get user role (Buyer/Seller)

        if (!userId || !userRole) {
            throw new Error("User not logged in.");
        }

        const senderModel = userRole === "buyer" ? "Buyer" : "Seller"; // ✅ Dynamically set senderModel

        const response = await axios.post("/chats/send", {
            chatId,
            message,
            sender: userId, // ✅ Ensure sender ID is sent
            senderModel, // ✅ Now dynamically sets Buyer/Seller
        }, {
            headers: { "auth-token": localStorage.getItem("token") }
        });

        return response.data;
    } catch (error) {
        console.error("Error sending message:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to send message.");
    }
};





// ✅ Start a Chat and Redirect to Chat Page
// ✅ Fix the API endpoint to `/api/chats/start`
// ✅ Start a Chat and Redirect to Chat Page
export const startChatWithSeller = async (bookId, sellerId, navigate) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.post("/chats/start", { bookId, sellerId }, {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Chat Response:", response.data); // ✅ Debugging log

        if (response.data.chat && response.data.chat._id) {
            // ✅ Redirect to the chat page with the chatId
            navigate(`/buyer/chat/${response.data.chat._id}`);
        } else {
            throw new Error("Chat ID not received.");
        }
    } catch (error) {
        console.error("Error starting chat:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to start chat.");
    }
};


// ✅ Fetch Chat by Chat ID
export const getChatById = async (chatId) => {
    try {
        const response = await axios.get(`/chats/${chatId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching chat:", error.response?.data || error.message);
        throw new Error("Failed to fetch chat.");
    }
};

