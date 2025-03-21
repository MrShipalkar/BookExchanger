const Chat = require("../models/Chat");
const Book = require("../models/Book");
const Seller = require("../models/Seller");
const Buyer = require("../models/Buyer");

// 📌 Start a Chat (Only Buyer can initiate)
// 📌 Start a Chat (Only Buyer can initiate)
const startChatWithSeller = async (req, res) => {
    try {
        const { bookId, sellerId } = req.body;
        const buyerId = req.user.id;  // ✅ Ensure token is being used correctly

        console.log("Starting chat with:", { buyerId, bookId, sellerId });

        // Check if book exists
        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ message: "Book not found." });

        // Check if seller exists
        const seller = await Seller.findById(sellerId);
        if (!seller) return res.status(404).json({ message: "Seller not found." });

        // Check if chat already exists
        let chat = await Chat.findOne({ book: bookId, buyer: buyerId, seller: sellerId });

        if (!chat) {
            chat = new Chat({
                book: bookId,
                buyer: buyerId,
                seller: sellerId,
                messages: [],
            });
            await chat.save();
        }

        console.log("Chat Started Successfully:", chat);

        res.status(200).json({ message: "Chat started!", chat });

    } catch (error) {
        console.error("❌ Error starting chat:", error);
        res.status(500).json({ message: "Server error." });
    }
};



// 📌 Send a Message (Buyer & Seller)
// 📌 Send a Message (Buyer & Seller)
const sendMessage = async (req, res) => {
    try {
        const { chatId, message } = req.body;
        const senderId = req.user.id;

        // ✅ Find chat
        const chat = await Chat.findById(chatId);
        if (!chat) return res.status(404).json({ message: "Chat not found." });

        // ✅ Ensure sender is part of the chat
        if (chat.buyer.toString() !== senderId && chat.seller.toString() !== senderId) {
            return res.status(403).json({ message: "Unauthorized to send messages in this chat." });
        }

        // ✅ Determine sender's role dynamically
        const senderModel = chat.buyer.toString() === senderId ? "Buyer" : "Seller";

        // ✅ Add message
        const newMessage = {
            sender: senderId,
            senderModel,
            message,
            timestamp: new Date()
        };
        chat.messages.push(newMessage);
        chat.lastUpdated = Date.now();
        await chat.save();

        // ✅ Send updated chat
        res.status(200).json({ message: "Message sent!", chat });

    } catch (error) {
        console.error("❌ Error sending message:", error);
        res.status(500).json({ message: "Server error." });
    }
};



// 📌 Get Messages for a Chat (Both Buyer & Seller)
const getChat = async (req, res) => {
    try {
        const { chatId } = req.params;

        // ✅ Find chat and populate details
        const chat = await Chat.findById(chatId)
            .populate("buyer", "name email")
            .populate("seller", "name email shopName")
            .populate("book", "title images")
            .populate("messages.sender", "name email"); // ✅ Populate sender details

        if (!chat) return res.status(404).json({ message: "Chat not found." });

        // ✅ Ensure messages include senderModel for frontend alignment
        const formattedMessages = chat.messages.map(msg => ({
            sender: msg.sender._id, 
            senderModel: msg.senderModel, // ✅ Include senderModel ("Buyer" or "Seller")
            message: msg.message,
            timestamp: msg.timestamp
        }));

        res.status(200).json({
            _id: chat._id,
            book: chat.book,
            buyer: chat.buyer,
            seller: chat.seller,
            messages: formattedMessages, // ✅ Send properly formatted messages
        });

    } catch (error) {
        console.error("❌ Error fetching chat:", error);
        res.status(500).json({ message: "Server error." });
    }
};


// 📌 Get all Chats for a User (Both Buyer & Seller)
const getAllChats = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        console.log(`Fetching chats for ${userRole} (User ID: ${userId})`); // ✅ Debugging log

        let chats;
        if (userRole === "buyer") {
            chats = await Chat.find({ buyer: userId })
                .populate("seller", "name shopName")
                .populate("book", "title images")
                .sort({ lastUpdated: -1 });
        } else {
            chats = await Chat.find({ seller: userId })  
                .populate("buyer", "name email")
                .populate("book", "title images")
                .sort({ lastUpdated: -1 });
        }

        console.log(`Fetched ${chats.length} chats for ${userRole} (User ID: ${userId})`); // ✅ Debugging log

        res.status(200).json(chats);
    } catch (error) {
        console.error("❌ Error fetching chats:", error);
        res.status(500).json({ message: "Server error." });
    }
};



// 📌 Export Controllers
module.exports = {
    startChatWithSeller,
    sendMessage,
    getChat,
    getAllChats
};
