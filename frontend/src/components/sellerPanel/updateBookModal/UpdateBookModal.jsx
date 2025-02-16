import React, { useState } from "react";
import "./UpdateBookModal.css";
import { updateBook } from "../../../services/bookService";

const UpdateBookModal = ({ book, onClose, onUpdateSuccess }) => {
    const [formData, setFormData] = useState({
        title: book.title,
        author: book.author,
        price: book.price,
        rentPrice: book.rentPrice || "",
        genre: book.genre,
        condition: book.condition,
        isRentable: book.isRentable,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            await updateBook(book._id, formData);
            onUpdateSuccess(); // Refresh book list in ManageBooks
            onClose(); // Close modal
        } catch (error) {
            console.error("Error updating book:", error);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h3>Update Book</h3>
                <form onSubmit={handleUpdate}>
                    <label>Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required />

                    <label>Author</label>
                    <input type="text" name="author" value={formData.author} onChange={handleChange} required />

                    <label>Price (₹)</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} required />

                    <label>Rent Price (₹)</label>
                    <input type="number" name="rentPrice" value={formData.rentPrice} onChange={handleChange} />

                    <label>Genre</label>
                    <input type="text" name="genre" value={formData.genre} onChange={handleChange} required />

                    <label>Condition</label>
                    <input type="text" name="condition" value={formData.condition} onChange={handleChange} required />

                    <label className="tick-label">
                        <input type="checkbox" name="isRentable" checked={formData.isRentable} onChange={handleChange} />
                        <span>Rentable</span>
                    </label>

                    <button type="submit">Update Book</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default UpdateBookModal;
