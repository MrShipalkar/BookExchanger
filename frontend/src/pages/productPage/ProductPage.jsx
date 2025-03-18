import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getBookById } from "../../services/bookService";

const ProductPage = () => {
    const { bookId } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!bookId) {
            console.error("No book ID provided");
            setLoading(false);
            return;
        }

        const fetchBook = async () => {
            try {
                const data = await getBookById(bookId);
                setBook(data);
            } catch (error) {
                console.error("Error fetching book details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [bookId]);

    if (loading) return <p>Loading...</p>;
    if (!book) return <p>Book not found.</p>;

    return (
        <div className="book-details">
            <h2>{book.title}</h2>
            <img src={book.images?.[0] || "default-book.jpg"} alt={book.title} />
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Genre:</strong> {book.genre}</p>
            <p><strong>Description:</strong> {book.description}</p>
            <p><strong>Price:</strong> ₹{book.price}</p>
            <button>Add to Cart</button>
        </div>
    );
};

export default ProductPage;
