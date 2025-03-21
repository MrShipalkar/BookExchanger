const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true }, // Book being discussed
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "Buyer", required: true }, // Buyer who initiates chat
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true }, // Seller of the book
    messages: [
      {
        sender: { type: mongoose.Schema.Types.ObjectId, refPath: "senderModel", required: true }, // ID of sender
        senderModel: { type: String, enum: ["Buyer", "Seller"], required: true }, // Sender role
        message: { type: String, required: true }, // Message content
        timestamp: { type: Date, default: Date.now } // Message timestamp
      }
    ],
    lastUpdated: { type: Date, default: Date.now }, // Helps in sorting chats by recent activity
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
