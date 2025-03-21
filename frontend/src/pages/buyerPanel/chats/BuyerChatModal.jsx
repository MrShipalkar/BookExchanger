import React, { useState, useEffect, useRef } from "react";
import { getChatById, sendMessage } from "../../../services/chatService";
import { io } from "socket.io-client";
import "./BuyerChatModal.css";

const socket = io("http://localhost:5000");

const BuyerChatModal = ({ chatId, onClose }) => {
    const [chat, setChat] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem("userId");
    const messagesEndRef = useRef(null);

    const formatTime = (timestamp) => {
        if (!timestamp) return "Just now";
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
        const fetchChat = async () => {
            try {
                const chatData = await getChatById(chatId);
                setChat(chatData);
            } catch (error) {
                console.error("Error fetching chat:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChat();
        socket.emit("join_chat", chatId);

        socket.on("receive_message", (newMessage) => {
            setChat((prevChat) => ({
                ...prevChat,
                messages: [...prevChat.messages, newMessage]
            }));
        });

        return () => socket.off("receive_message");
    }, [chatId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat]);

    const handleSendMessage = async () => {
        if (!message.trim()) return;
        try {
            await sendMessage(chatId, message);
            socket.emit("send_message", { chatId, sender: userId, senderModel: "Buyer", message });
            setMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    if (loading || !chat) return null;

    return (
        <div className="chat-modal-backdrop" onClick={onClose}>
            <div className="buyer-chat-window modal" onClick={(e) => e.stopPropagation()}>
                <span className="chat-modal-close-btn" onClick={onClose}>❌</span>
                <h2 className="buyer-chat-title">Chat with {chat?.seller?.name || "Seller"}</h2>

                <div className="buyer-messages-container">
                    {chat?.messages.map((msg, index) => {
                        const isBuyer = msg.senderModel === "Buyer";
                        return (
                            <div key={index} className={`buyer-message-wrapper ${isBuyer ? "buyer-message" : "buyer-seller-message"}`}>
                                <div className="buyer-message-content">
                                    <p>{msg.message}</p>
                                    <span className="buyer-timestamp">{formatTime(msg.timestamp)}</span>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                <div className="buyer-message-input">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button onClick={handleSendMessage} disabled={!message.trim()}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default BuyerChatModal;
