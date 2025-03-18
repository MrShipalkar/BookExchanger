import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBooks } from "../../services/bookService";
import "./BuyerDashboard.css";

const BuyerDashboard = () => {
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const data = await getAllBooks();
                setBooks(data || []);
            } catch (error) {
                console.error("Error fetching books:", error);
                setBooks([]);
            }
        };
        fetchBooks();
    }, []);

    const handleBookClick = (bookId) => {
        navigate(`/buyer/book/${bookId}`);
    };

    const filteredBooks = (books || []).filter(book =>
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="buyer-dashboard">
            <h2>All Books</h2>
            <input
                type="text"
                placeholder="Search by title or author..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-bar"
            />
            <div className="book-grid">
                {filteredBooks.length === 0 ? (
                    <p>No books available</p>
                ) : (
                    filteredBooks.map((book) => (
                        <div key={book._id} className="book-card" onClick={() => handleBookClick(book._id)}>
                            <img src={book.images?.[0] || "default-book.jpg"} alt={book.title} />
                            <h3>{book.title}</h3>
                            <p>By {book.author}</p>
                            <p>₹{book.price}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default BuyerDashboard;
