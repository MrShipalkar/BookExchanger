const Book = require('../models/Book');

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
        const { title, author, genre, description, price, rentPrice, isRentable, condition, publicationDate } = req.body;

        if (!title || !author || !price) {
            return res.status(400).json({ message: 'Title, Author, and Price are required' });
        }

        const images = req.files ? req.files.map(file => file.path) : [];

        const book = new Book({
            title,
            author,
            genre,
            description,
            price,
            rentPrice: isRentable ? rentPrice : undefined,
            isRentable: !!isRentable,
            condition,
            publicationDate,
            images,
            seller: req.user.id // Set seller ID from authenticated user
        });

        await book.save();
        res.status(201).json({ message: 'Book added successfully', book });
    } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).json({ message: 'Server error', error });
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
