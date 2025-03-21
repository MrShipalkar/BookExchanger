import React, { useState, useEffect } from "react";
import { getChat, sendMessage } from "../../../services/chatService";
import { io } from "socket.io-client";
import "./SellerChatWindow.css";

// ✅ Dynamically set backend URL
const socket = io("http://localhost:5000"); // ✅ Connect to WebSocket server


const SellerChatWindow = ({ chat }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const userId = localStorage.getItem("userId"); // Get logged-in seller ID

    const formatTime = (timestamp) => {
        if (!timestamp) return "Just now"; // Default for new messages
    
        const now = new Date();
        const msgTime = new Date(timestamp);
        const diff = Math.abs(now - msgTime) / 1000; // Difference in seconds
    
        if (diff < 60) return "Just now"; // Show "Just now" if within 60 seconds
    
        return msgTime.toLocaleString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
    };
    

    useEffect(() => {
        if (!chat?._id) return;
        fetchMessages();
        socket.emit("join_chat", chat._id); // ✅ Join WebSocket room for this chat

        // ✅ Listen for incoming messages
        socket.on("receive_message", (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        return () => socket.off("receive_message");
    }, [chat]);

    const fetchMessages = async () => {
        try {
            const updatedChat = await getChat(chat._id);
            console.log("📩 Seller Chat Data:", updatedChat);
            setMessages(updatedChat.messages || []);
        } catch (error) {
            console.error("❌ Error fetching chat:", error);
        }
    };

    const handleSendMessage = async () => {
        if (!message.trim()) return;

        try {
            await sendMessage(chat._id, message);
            socket.emit("send_message", { chatId: chat._id, sender: userId, senderModel: "Seller", message }); // ✅ Emit message
            // setMessages((prevMessages) => [...prevMessages, { sender: userId, senderModel: "Seller", message }]);
            setMessage("");
        } catch (error) {
            console.error("❌ Error sending message:", error);
        }
    };

    if (!chat?._id) {
        return <p className="seller-chat-error">⚠️ No chat selected</p>;
    }

    return (
        <div className="seller-chat-window">
            <div className="seller-chat-header">
                <h3>Chat with {chat?.buyer?.name || "Unknown Buyer"}</h3>
            </div>
            <div className="seller-messages-container">
                {messages.map((msg, index) => {
                    const isSeller = msg.sender === userId;
                    return (
                        <div key={index} className={`seller-message-wrapper ${isSeller ? "seller-message" : "seller-buyer-message"}`}>
                            <div className="seller-message-content">
                                <p>{msg.message}</p>
                                <span className="buyer-timestamp">{formatTime(msg.timestamp)}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="seller-message-input">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={handleSendMessage} disabled={!message.trim()}>Send</button>
            </div>
        </div>
    );
};

export default SellerChatWindow;
