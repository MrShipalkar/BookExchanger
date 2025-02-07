import React, { useState, useEffect } from "react";
import "./ManageBooks.css";
import { getBooksBySeller } from "../../../services/bookService";
import { FaEdit, FaTrash } from "react-icons/fa"; // Import icons

const ManageBooks = () => {
    const [books, setBooks] = useState([
        {
            _id: "1",
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            price: 10,
            rentPrice: 3,
            isRentable: true,
            genre: "Classic",
            condition: "Good",
        },
        {
            _id: "2",
            title: "To Kill a Mockingbird",
            author: "Harper Lee",
            price: 12,
            rentPrice: 4,
            isRentable: false,
            genre: "Fiction",
            condition: "New",
        },
        {
            _id: "3",
            title: "1984",
            author: "George Orwell",
            price: 15,
            rentPrice: 5,
            isRentable: true,
            genre: "Dystopian",
            condition: "Acceptable",
        },
    ]);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await getBooksBySeller();
            setBooks(response.data);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    const handleEdit = (id) => {
        console.log("Edit book with ID:", id);
        // Add logic to edit book
    };

    const handleDelete = (id) => {
        console.log("Delete book with ID:", id);
        // Add logic to delete book
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
                    {books.map((book) => (
                        <tr key={book._id}>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>${book.price}</td>
                            <td>${book.rentPrice}</td>
                            <td>{book.genre}</td>
                            <td>{book.condition}</td>
                            <td>{book.isRentable ? "Yes" : "No"}</td>
                            <td className="action-buttons">
                                <button className="edit-btn" onClick={() => handleEdit(book._id)}>
                                    <FaEdit />
                                </button>
                                <button className="delete-btn" onClick={() => handleDelete(book._id)}>
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageBooks;
