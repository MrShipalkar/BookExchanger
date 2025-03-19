const Book = require('../models/Book');
const cloudinary = require("../config/cloudinaryConfig");
const uploadImagesToCloudinary = require("../utils/cloudinaryUpload"); // Import function
const mongoose = require("mongoose");




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
// ✅ Add a new book
const addBook = async (req, res) => {
    try {
        console.log("📥 Received Request Body:", req.body);
        console.log("📸 Received Files:", req.files);

        // ✅ Extract Book Type and Branch
        const { bookType } = req.body;
        let branch = req.body.branch;

        // ✅ Ensure `branch` is a string (sometimes it's an array)
        if (Array.isArray(branch)) {
            branch = branch[0]; // Take the first value if it's an array
        }

        // ✅ Check for empty or invalid values
        if (!branch || typeof branch !== "string") {
            return res.status(400).json({ message: "❌ Invalid or missing branch selection." });
        }

        branch = branch.trim(); // ✅ Now we can safely use `.trim()`

        const validBookTypes = ["new", "old"];
        const validBranches = [
            "Computer Science",
            "Mechanical",
            "Civil",
            "Electrical",
            "Electronics",
            "IT",
            "Other",
        ]; // ✅ Ensure it matches schema

        // ✅ Validate Book Type
        if (!bookType || !validBookTypes.includes(bookType)) {
            return res.status(400).json({ message: "❌ Invalid or missing book type. Must be 'new' or 'old'." });
        }

        // ✅ Validate Branch
        if (!validBranches.includes(branch)) {
            return res.status(400).json({ message: `❌ Invalid branch selection: ${branch}` });
        }

        // ✅ Validate Common Fields
        if (!req.body.title || !req.body.author || !req.body.original_price) {
            return res.status(400).json({ message: "❌ Title, Author, and Original Price are required." });
        }

        if (!req.files || req.files.length < 2) {
            return res.status(400).json({ message: "❌ Please upload at least 2 images." });
        }

        // ✅ Upload Images to Cloudinary
        const images = await uploadImagesToCloudinary(req.files);
        console.log("✅ Uploaded Image URLs:", images);

        // ✅ Create Book Object
        const bookData = {
            bookType,
            title: req.body.title.trim(),
            author: req.body.author.trim(),
            branch, // ✅ Now `branch` is always a clean string
            description: req.body.description.trim(),
            isRentable: req.body.isRentable === "true",
            condition: req.body.condition,
            publicationDate: req.body.publicationDate,
            images,
            seller: req.user.id,
        };

        // ✅ Handle New Books
        if (bookType === "new") {
            bookData.original_price = req.body.original_price;
            bookData.rentPrice = req.body.rentPrice || null;
        }

        // ✅ Handle Old Books
        if (bookType === "old") {
            if (!req.body.publication_year || !req.body.pages) {
                return res.status(400).json({ message: "❌ Publication Year and Pages are required for old books." });
            }

            bookData.original_price = req.body.original_price;
            bookData.publication_year = req.body.publication_year;
            bookData.pages = req.body.pages;
            bookData.predictedPrice = req.body.predictedPrice || null;
            bookData.acceptPredictedPrice = req.body.acceptPredictedPrice || "no";
            bookData.customPrice = req.body.customPrice || null;

            bookData.original_price = bookData.acceptPredictedPrice === "yes" ? bookData.predictedPrice : bookData.customPrice;
            if (!bookData.original_price) {
                return res.status(400).json({ message: "❌ Original Price is required (either predicted or custom)." });
            }
        }

        // ✅ Save Book to Database
        const book = new Book(bookData);
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

        const allowedUpdates = ['title', 'author', 'branch', 'description', 'price', 'rentPrice', 'isRentable', 'condition', 'publicationDate'];

        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                book[key] = req.body[key];
            }
        });

        if (req.files && req.files.length > 0) {
            book.images = req.files.map(file => file.path);
        }

        await book.save();
        res.status(200).json({ message: '✅ Book updated successfully', book });
    } catch (error) {
        console.error('❌ Error updating book:', error);
        res.status(500).json({ message: '❌ Server error', error });
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

// ✅ Get all books for buyer dashboard
const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find().populate("seller", "name"); // Fetch all books with seller info
        res.status(200).json(books);
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "❌ Server error", error });
    }
};

// ✅ Get a single book by ID
const getBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json(book);
    } catch (error) {
        console.error("Error fetching book by ID:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

// ✅ Get Similar Books Based on Genre
const getSimilarBooks = async (req, res) => {
    try {
        const { id } = req.params;

        console.log("📥 Received Book ID for Similar Books:", id); // Debugging

        // Find the current book by ID
        const currentBook = await Book.findById(id);
        if (!currentBook) {
            console.log("❌ Book not found for ID:",id);
            return res.status(404).json({ message: "Book not found" });
        }

        console.log("✅ Found Book:", currentBook);

        // Fetch books with the same branch but exclude the current book
        const similarBooks = await Book.find({
            branch: currentBook.branch, // Match books from the same branch
            _id: { $ne: id }, // Exclude the current book
        }).limit(10);

        console.log("✅ Found Similar Books:", similarBooks);

        res.status(200).json(similarBooks);
    } catch (error) {
        console.error("❌ Error fetching similar books:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};




const getBranches = async (req, res) => {
    try {
        const branches = Book.schema.path("branch").enumValues; // ✅ Fetch ENUM values directly from schema
        res.status(200).json({ branches });
    } catch (error) {
        console.error("❌ Error fetching branches:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

module.exports = { getBooksBySeller, addBook, updateBook, deleteBook, getAllBooks, getBookById, getSimilarBooks, getBranches };
