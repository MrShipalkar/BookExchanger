import React, { useState, useEffect } from "react";
import { getAllChats, getChat } from "../../../services/chatService";
import SellerChatModal from "./SellerChatModal"; // ✅ Updated to use Modal
import "./SellerChats.css";

const SellerChats = () => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [showChatModal, setShowChatModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchChats();
    }, []);

    const fetchChats = async () => {
        try {
            setLoading(true);
            const chatData = await getAllChats();
            setChats(chatData);
        } catch (error) {
            console.error("❌ Error fetching seller chats:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChatClick = async (chatId) => {
        try {
            const chatDetails = await getChat(chatId);
            setSelectedChat(chatDetails);
            setShowChatModal(true); // ✅ Open modal when a chat is selected
        } catch (error) {
            console.error("Error fetching chat details:", error);
        }
    };

    return (
        <div className="seller-chat-container">
            {loading ? <p>Loading chats...</p> : null}
            {chats.length === 0 ? (
                <p>No chats available</p>
            ) : (
                <div className="chat-list">
                    {chats.map((chat) => (
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

            {/* ✅ Show Chat Modal when a chat is selected */}
            {showChatModal && selectedChat && (
                <SellerChatModal chatId={selectedChat._id} onClose={() => setShowChatModal(false)} />
            )}
        </div>
    );
};

export default SellerChats;
