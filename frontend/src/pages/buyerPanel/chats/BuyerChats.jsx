import React, { useState, useEffect } from "react";
import { getAllChats } from "../../../services/chatService";
import { useNavigate } from "react-router-dom";
import "./BuyerChats.css";

const BuyerChats = () => {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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

    const handleChatClick = (chatId) => {
        navigate(`/buyer/chat/${chatId}`);
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
        </div>
    );
};

export default BuyerChats;
