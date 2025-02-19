const Book = require('../models/Book');
const cloudinary = require("../config/cloudinaryConfig");
const uploadImagesToCloudinary = require("../utils/cloudinaryUpload"); // Import function



// ✅ Fetch books listed by the seller
const getBooksBySeller = async (req, res) => {
    try {
        const sellerId = req.user.id; // Extract seller ID from authenticated user
        const books = await Book.find({ seller: sellerId });

        res.status(200).json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// ✅ Add a new book

const addBook = async (req, res) => {
    try {
        console.log("📥 Received Request Body:", req.body);
        console.log("📸 Received Files:", req.files);

        if (!req.body.title || !req.body.author || !req.body.price) {
            return res.status(400).json({ message: "❌ Title, Author, and Price are required" });
        }

        if (!req.files || req.files.length < 2) {
            return res.status(400).json({ message: "❌ Please upload at least 2 images." });
        }

        // ✅ Debug file sizes before uploading
        req.files.forEach((file, index) => {
            console.log(`📸 File ${index + 1}:`, file.originalname, file.mimetype, file.size, "bytes");
        });

        // ✅ Upload Images to Cloudinary
        const images = await uploadImagesToCloudinary(req.files);
        console.log("✅ Uploaded Image URLs:", images);

        // ✅ Save Book Data
        const book = new Book({
            title: req.body.title,
            author: req.body.author,
            genre: req.body.genre,
            description: req.body.description,
            price: req.body.price,
            rentPrice: req.body.rentPrice || null,
            isRentable: req.body.isRentable === "true",
            condition: req.body.condition,
            publicationDate: req.body.publicationDate,
            images, // Save Cloudinary URLs
            original_price: req.body.original_price || null,
            pages: req.body.pages || null,
            publication_year: req.body.publication_year || null,
            predictedPrice: req.body.predictedPrice || null,
            acceptPredictedPrice: req.body.acceptPredictedPrice || null,
            seller: req.user.id,
        });

        await book.save();
        res.status(201).json({ message: "✅ Book added successfully", book });

    } catch (error) {
        console.error("❌ Server Error:", error.message);
        res.status(500).json({ message: "❌ Internal Server Error", error: error.message });
    }
};






























// ✅ Update a book
const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);

        if (!book) return res.status(404).json({ message: 'Book not found' });

        if (book.seller.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized to update this book' });
        }

        const allowedUpdates = ['title', 'author', 'genre', 'description', 'price', 'rentPrice', 'isRentable', 'condition', 'publicationDate'];

        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                book[key] = req.body[key];
            }
        });

        if (req.files && req.files.length > 0) {
            book.images = req.files.map(file => file.path);
        }

        await book.save();
        res.status(200).json({ message: 'Book updated successfully', book });
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// ✅ Delete a book
const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);

        if (!book) return res.status(404).json({ message: 'Book not found' });

        if (book.seller.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized to delete this book' });
        }

        await book.deleteOne();
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = { getBooksBySeller, addBook, updateBook, deleteBook };
