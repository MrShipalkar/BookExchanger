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
                setSelectedImage(bookData.images?.[0] || "/default-book.jpg");

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
                    <p className="author"><strong>By:</strong> {book.author}</p>
                    <p className="book-type"><strong>Book Type:</strong> {book.bookType}</p>
                    <p className="branch"><strong>Branch:</strong> {book.branch}</p>
                    <p className="condition"><strong>Condition:</strong> {book.condition}</p>
                    <p className="pages"><strong>Pages:</strong> {book.pages || "N/A"}</p>
                    <p className="publication-date">
                        <strong>Publication Date:</strong> {book.publicationDate ? new Date(book.publicationDate).toLocaleDateString() : "N/A"}
                    </p>
                    <p className="price"><strong>Price:</strong> ₹{book.original_price}</p>
                    <p className="predicted-price"><strong>Predicted Price:</strong> ₹{book.predictedPrice || "N/A"}</p>
                    <p className="rent-price"><strong>Rent Price:</strong> {book.isRentable ? `₹${book.rentPrice}` : "Not Available"}</p>
                    <p className="seller">
                        <strong>Seller:</strong> {book.seller?.name || "Unknown"}
                    </p>

                    <p className="description"><strong>Description:</strong> {book.description || "No description available."}</p>

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
                                <img src={sBook.images?.[0] || "/default-book.jpg"} alt={sBook.title} />
                                <p>{sBook.title.length > 20 ? sBook.title.substring(0, 20) + "..." : sBook.title}</p>
                                <p><strong>₹{sBook.original_price}</strong></p>
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
