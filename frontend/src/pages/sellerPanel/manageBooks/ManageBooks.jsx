import React, { useState, useEffect } from "react";
import "./ManageBooks.css";
import { getBooksBySeller, addBook, updateBook, deleteBook } from "../../../services/bookService";

const ManageBooks = () => {
    const [books, setBooks] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        price: "",
        rentPrice: "",
        isRentable: false,
        genre: "",
        description: "",
        condition: "good",
        publicationDate: "",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editBookId, setEditBookId] = useState(null);

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

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ 
            ...formData, 
            [name]: type === "checkbox" ? checked : value 
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updateBook(editBookId, formData);
            } else {
                await addBook(formData);
            }
            fetchBooks();
            resetForm();
        } catch (error) {
            console.error("Error adding/updating book:", error);
        }
    };

    const handleEdit = (book) => {
        setIsEditing(true);
        setEditBookId(book._id);
        setFormData({
            title: book.title,
            author: book.author,
            price: book.price,
            rentPrice: book.rentPrice,
            isRentable: book.isRentable,
            genre: book.genre,
            description: book.description,
            condition: book.condition,
            publicationDate: book.publicationDate,
        });
    };

    const handleDelete = async (id) => {
        try {
            await deleteBook(id);
            fetchBooks();
        } catch (error) {
            console.error("Error deleting book:", error);
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            author: "",
            price: "",
            rentPrice: "",
            isRentable: false,
            genre: "",
            description: "",
            condition: "good",
            publicationDate: "",
        });
        setIsEditing(false);
        setEditBookId(null);
    };

    return (
        <div className="manage-books-container">
            <h2>Manage Books</h2>

            {/* Add/Edit Book Form */}
            <form onSubmit={handleSubmit} className="book-form">
                <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleInputChange} required />
                <input type="text" name="author" placeholder="Author" value={formData.author} onChange={handleInputChange} required />
                <input type="number" name="price" placeholder="Price ($)" value={formData.price} onChange={handleInputChange} required />
                <input type="number" name="rentPrice" placeholder="Rent Price ($)" value={formData.rentPrice} onChange={handleInputChange} />
                
                <label>
                    <input type="checkbox" name="isRentable" checked={formData.isRentable} onChange={handleInputChange} />
                    Rentable
                </label>

                <input type="text" name="genre" placeholder="Genre" value={formData.genre} onChange={handleInputChange} required />
                <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} required />
                
                <select name="condition" value={formData.condition} onChange={handleInputChange} required>
                    <option value="new">New</option>
                    <option value="good">Good</option>
                    <option value="acceptable">Acceptable</option>
                </select>

                <input type="date" name="publicationDate" value={formData.publicationDate} onChange={handleInputChange} required />

                <button type="submit">{isEditing ? "Update Book" : "Add Book"}</button>
            </form>

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
                        <th>Actions</th>
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
                            <td>
                                <button onClick={() => handleEdit(book)}>Edit</button>
                                <button onClick={() => handleDelete(book._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageBooks;
