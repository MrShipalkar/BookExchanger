import React, { useState, useEffect } from "react";
import "./ManageBooks.css";
import { getBooksBySeller, deleteBook } from "../../../services/bookService";
import { FaTrash, FaEdit } from "react-icons/fa";
import UpdateBookModal from "../../../components/sellerPanel/updateBookModal/UpdateBookModal"; // Import UpdateBookModal

const ManageBooks = () => {
    const [books, setBooks] = useState([]);
    const [editBook, setEditBook] = useState(null); // Holds book to be edited

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await getBooksBySeller();
            setBooks(response);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this book?")) return;

        try {
            await deleteBook(id);
            setBooks(books.filter((book) => book._id !== id));
        } catch (error) {
            console.error("Error deleting book:", error);
        }
    };

    const handleEditClick = (book) => {
        setEditBook(book); // Open update modal with selected book
    };

    return (
        <div className="manage-books-container">
            <h2>Manage Books</h2>

            {/* Books Table */}
            <table className="books-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Price</th>
                        <th>Rent Price</th>
                        <th>Genre</th>
                        <th>Condition</th>
                        <th>Rentable</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {books.length > 0 ? (
                        books.map((book) => (
                            <tr key={book._id}>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td>₹{book.price}</td>
                                <td>₹{book.rentPrice}</td>
                                <td>{book.genre}</td>
                                <td>{book.condition}</td>
                                <td>{book.isRentable ? "Yes" : "No"}</td>
                                <td className="action-buttons">
                                    <button className="edit-btn" onClick={() => handleEditClick(book)}>
                                        <FaEdit />
                                    </button>
                                    <button className="delete-btn" onClick={() => handleDelete(book._id)}>
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8">No books found.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Update Book Modal */}
            {editBook && (
                <UpdateBookModal
                    book={editBook}
                    onClose={() => setEditBook(null)}
                    onUpdateSuccess={fetchBooks} // Refresh book list after update
                />
            )}
        </div>
    );
};

export default ManageBooks;
