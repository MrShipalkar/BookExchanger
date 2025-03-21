import React, { useState, useEffect } from "react";
import { getAllChats, getChat } from "../../../services/chatService";
import SellerChatWindow from "./SellerChatWindow";
import "./SellerChats.css";

const SellerChats = () => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("📌 SellerChats component mounted"); // ✅ Check if component loads
        fetchChats();
    }, []);

    const fetchChats = async () => {
        try {
            console.log("🔍 Fetching seller chats...");
            setLoading(true);
            const chatData = await getAllChats();
            console.log("✅ Received seller chats:", chatData); // ✅ Debugging log
            setChats(chatData);
        } catch (error) {
            console.error("❌ Error fetching seller chats:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleChatClick = async (chatId) => {
        try {
            console.log("Fetching chat details for:", chatId); // ✅ Debugging Log
            const chatDetails = await getChat(chatId);
            setSelectedChat(chatDetails);
        } catch (error) {
            console.error("Error fetching chat details:", error);
        }
    };
    

    return (
        <div className="seller-chat-container">
            {/* <h2>Seller Chats</h2> */}
            {loading ? <p>Loading chats...</p> : null}
            {chats.length === 0 ? (
                <p>No chats available</p>
            ) : (
                <div className="chat-list">
                    {chats.map(chat => (
                        <div
                            key={chat._id}
                            className={`chat-item ${selectedChat?._id === chat._id ? "active" : ""}`}
                            onClick={() => handleChatClick(chat._id)}

                        >
                            <p><strong>📚 Book:</strong> {chat.book?.title || "Unknown Book"}</p>
                            <p><strong>👤 Buyer:</strong> {chat.buyer?.name || "Unknown Buyer"}</p>
                        </div>
                    ))}
                </div>
            )}
            {selectedChat && <SellerChatWindow chat={selectedChat} />}
        </div>
    );
};

export default SellerChats;
