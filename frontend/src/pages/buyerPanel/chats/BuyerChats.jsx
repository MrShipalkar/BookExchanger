import React, { useState, useEffect } from "react";
import { getAllChats, getChatById } from "../../../services/chatService";
import BuyerChatModal from "./BuyerChatModal"; // ✅ Import modal
import "./BuyerChats.css";

const BuyerChats = () => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [showChatModal, setShowChatModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const chatData = await getAllChats();
                setChats(chatData);
            } catch (error) {
                console.error("Error fetching chats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, []);

    const handleChatClick = async (chatId) => {
        try {
            const chatDetails = await getChatById(chatId);
            setSelectedChat(chatDetails);
            setShowChatModal(true); // ✅ Open modal when chat is clicked
        } catch (error) {
            console.error("Error fetching chat details:", error);
        }
    };

    return (
        <div className="buyer-chats-container">
            <h2>📩 Your Chats</h2>
            {loading ? (
                <p>Loading chats...</p>
            ) : chats.length === 0 ? (
                <p>No active chats.</p>
            ) : (
                <div className="chat-list">
                    {chats.map((chat) => (
                        <div key={chat._id} className="chat-item" onClick={() => handleChatClick(chat._id)}>
                            <img src={chat.book.images?.[0] || "/default-book.jpg"} alt={chat.book.title} className="book-image" />
                            <div className="chat-details">
                                <h3>{chat.book.title}</h3>
                                <p>👤 Seller: {chat.seller.name || "Unknown"}</p>
                                <p>📅 Last Updated: {new Date(chat.lastUpdated).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ✅ Show Buyer Chat Modal when a chat is selected */}
            {showChatModal && selectedChat && (
                <BuyerChatModal chatId={selectedChat._id} onClose={() => setShowChatModal(false)} />
            )}
        </div>
    );
};

export default BuyerChats;
