import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBooks } from "../../../services/bookService";
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

    // Truncate long text
    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    // **Fix: Apply Search to All Categories**
    const filteredBooks = books.filter(
        (book) =>
            book.title.toLowerCase().includes(search.toLowerCase()) ||
            book.author.toLowerCase().includes(search.toLowerCase())
    );

    // Categorizing books **after filtering**
    const recommendedBooks = filteredBooks.filter(book => book.recommendations?.length > 0);
    const bestsellers = filteredBooks.filter(book => book.ratings?.average >= 4);

    // Group books by branch **after filtering**
    const booksByBranch = filteredBooks.reduce((acc, book) => {
        if (!acc[book.branch]) {
            acc[book.branch] = [];
        }
        acc[book.branch].push(book);
        return acc;
    }, {});

    return (
        <div className="buyer-dashboard">
            <h2>Explore Books</h2>

            {/* ✅ Search Bar */}
            <input
                type="text"
                placeholder="Search by title or author..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-bar"
            />

            {/* ✅ Show "No Books Found" if search returns nothing */}
            {filteredBooks.length === 0 ? (
                <p>No books found.</p>
            ) : (
                <>
                    {/* ✅ Recommended Books */}
                    {recommendedBooks.length > 0 && (
                        <div>
                            <h3>Recommended Books</h3>
                            <div className="book-grid">
                                {recommendedBooks.map((book) => (
                                    <div key={book._id} className="book-card" onClick={() => handleBookClick(book._id)}>
                                        <img src={book.images?.[0] || "default-book.jpg"} alt={book.title} />
                                        <h3>{truncateText(book.title, 20)}</h3>
                                        <p><strong>Author:</strong> {truncateText(book.author, 18)}</p>
                                        <p><strong>Price:</strong> ₹{book.original_price}</p>
                                        <p><strong>Rent Price:</strong> {book.rentPrice ? `₹${book.rentPrice}` : "Not Available"}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ✅ Bestsellers */}
                    {bestsellers.length > 0 && (
                        <div>
                            <h3>Bestsellers</h3>
                            <div className="book-grid">
                                {bestsellers.map((book) => (
                                    <div key={book._id} className="book-card" onClick={() => handleBookClick(book._id)}>
                                        <img src={book.images?.[0] || "default-book.jpg"} alt={book.title} />
                                        <h3>{truncateText(book.title, 20)}</h3>
                                        <p><strong>Author:</strong> {truncateText(book.author, 18)}</p>
                                        <p><strong>Price:</strong> ₹{book.original_price}</p>
                                        <p><strong>Rating:</strong> ⭐{book.ratings.average.toFixed(1)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ✅ Books Categorized by Branch */}
                    {Object.keys(booksByBranch).map((branch) => (
                        booksByBranch[branch].length > 0 && (
                            <div key={branch}>
                                <h3>{branch} Books</h3>
                                <div className="book-grid">
                                    {booksByBranch[branch].map((book) => (
                                        <div key={book._id} className="book-card" onClick={() => handleBookClick(book._id)}>
                                            <img src={book.images?.[0] || "default-book.jpg"} alt={book.title} />
                                            <h3>{truncateText(book.title, 20)}</h3>
                                            <p><strong>Author:</strong> {truncateText(book.author, 18)}</p>
                                            <p><strong>Price:</strong> ₹{book.original_price}</p>
                                            <p><strong>Condition:</strong> {book.condition}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    ))}
                </>
            )}
        </div>
    );
};

export default BuyerDashboard;
