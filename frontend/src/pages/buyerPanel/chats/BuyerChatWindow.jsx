import React, { useState, useEffect } from "react";
import { getChatById, sendMessage } from "../../../services/chatService";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import "./BuyerChatWindow.css";

const socket = io("http://localhost:5000"); // ✅ Connect to WebSocket server

const BuyerChatWindow = () => {
    const { chatId } = useParams();
    const [chat, setChat] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem("userId");

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
        socket.emit("join_chat", chatId); // ✅ Join WebSocket room for this chat

        socket.on("receive_message", (newMessage) => {
            setChat((prevChat) => ({
                ...prevChat,
                messages: [...prevChat.messages, newMessage]
            }));
        });

        return () => socket.off("receive_message");
    }, [chatId]);

    const handleSendMessage = async () => {
        if (!message.trim()) return;
        try {
            const response = await sendMessage(chatId, message);
            socket.emit("send_message", { chatId, sender: userId, senderModel: "Buyer", message }); // ✅ Emit message
            // setChat(response.chat);
            setMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };
 

    if (loading) return <p className="buyer-loading-message">⌛ Loading chat...</p>;
    if (!chat) return <p className="buyer-chat-error">⚠️ Chat not found</p>;

    return (
        <div className="buyer-chat-window">
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
    );
};

export default BuyerChatWindow;
