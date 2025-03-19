import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getBookById, getSimilarBooks } from "../../../services/bookService";
import "./ProductPage.css";

const ProductPage = () => {
    const { bookId } = useParams();
    const [book, setBook] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [similarBooks, setSimilarBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!bookId) {
            console.error("No book ID provided");
            setLoading(false);
            return;
        }

        const fetchBookDetails = async () => {
            try {
                const bookData = await getBookById(bookId);
                setBook(bookData);
                setSelectedImage(bookData.images?.[0] || "default-book.jpg");

                // Fetch similar books
                const similarBooksData = await getSimilarBooks(bookId);
                setSimilarBooks(similarBooksData);
            } catch (error) {
                console.error("Error fetching book details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookDetails();
    }, [bookId]);

    if (loading) return <p>Loading...</p>;
    if (!book) return <p>Book not found.</p>;

    return (
        <div className="product-page">
            <div className="product-container">
                {/* Left Side - Book Images */}
                <div className="image-section">
                    <div className="thumbnail-list">
                        {book.images?.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`Book preview ${index + 1}`}
                                className={`thumbnail ${selectedImage === img ? "active" : ""}`}
                                onClick={() => setSelectedImage(img)}
                            />
                        ))}
                    </div>
                    <img className="main-image" src={selectedImage} alt={book.title} />
                </div>

                {/* Right Side - Book Details */}
                <div className="details-section">
                    <h2>{book.title}</h2>
                    <p className="author">By {book.author}</p>
                    <p className="price">₹{book.price}</p>
                    <p className="rent-price">Rent Price: {book.rentPrice ? `₹${book.rentPrice}` : "Not Available"}</p>
                    <p className="seller">Seller: {book.sellerName || "Unknown"}</p>
                    <p className="description">{book.description.length > 150 ? book.description.substring(0, 150) + "..." : book.description}</p>

                    {/* Buttons */}
                    <div className="action-buttons">
                        <button className="add-to-cart">ADD TO CART</button>
                        <button className="buy-now">BUY NOW</button>
                    </div>
                </div>
            </div>

            {/* Similar Books Section */}
            <div className="similar-books">
                <h3>Similar Books</h3>
                <div className="scroll-container">
                    {similarBooks.length > 0 ? (
                        similarBooks.map((sBook) => (
                            <div key={sBook._id} className="similar-card">
                                <img src={sBook.images?.[0] || "default-book.jpg"} alt={sBook.title} />
                                <p>{sBook.title.length > 20 ? sBook.title.substring(0, 20) + "..." : sBook.title}</p>
                                <p><strong>₹{sBook.price}</strong></p>
                            </div>
                        ))
                    ) : (
                        <p>No similar books found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
