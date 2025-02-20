import React, { useState } from "react";
import "./AddBookModal.css";
import { addBook, predictBookPrice } from "../../../services/bookService";

const AddBookModal = ({ onClose }) => {
    const [step, setStep] = useState(1);
    const [bookType, setBookType] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        genre: "",
        description: "",
        price: "",
        rentPrice: "",
        isRentable: false,
        condition: "good",
        publicationDate: "",
        images: [],
        original_price: "",
        pages: "",
        publication_year: "",
        predictedPrice: "",
        acceptPredictedPrice: "yes",
        customPrice: "",
    });

    // ✅ Handle Input Change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    // ✅ Handle Image Upload
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + formData.images.length > 5) {
            alert("You can upload a maximum of 5 images.");
            return;
        }
        setFormData((prevState) => ({
            ...prevState,
            images: [...prevState.images, ...files],
        }));
    };

    // ✅ Remove Image
    const removeImage = (index) => {
        const newImages = [...formData.images];
        newImages.splice(index, 1);
        setFormData({ ...formData, images: newImages });
    };



    const handlePredictPrice = async () => {
        try {
            // ✅ Prepare book details for prediction
            const bookDetails = {
                condition: formData.condition,
                publication_year: parseInt(formData.publication_year, 10),
                original_price: parseFloat(formData.original_price),
                pages: parseInt(formData.pages, 10),
            };

            console.log("📤 Sending to Backend for Prediction:", bookDetails);

            // ✅ Call Backend API
            const predictedPrice = await predictBookPrice(bookDetails);

            console.log("📥 Predicted Price from API:", predictedPrice); // ✅ Debugging API Response

            // ✅ Ensure state updates properly
            setFormData((prevData) => ({
                ...prevData,
                predictedPrice: predictedPrice.toFixed(2), // Ensure it's formatted correctly
                acceptPredictedPrice: "yes",
            }));

        } catch (error) {
            console.error("❌ Prediction Error:", error);
            alert("❌ Failed to predict price.");
        }
    };



    // ✅ Move to Step 3 for Old Book
    const handleOldBookNext = (e) => {
        e.preventDefault();
        setStep(3);
    };

    // ✅ Submit Book to Backend

   const handleSubmit = async (e) => {
    e.preventDefault();

    // 🚨 Ensure required fields are not empty
    if (!formData.title.trim() || !formData.author.trim() || !formData.original_price.trim()) {
        alert("❌ Title, Author, and Original Price are required.");
        return;
    }

    if (formData.images.length < 2) {
        alert("❌ Please upload at least 2 images.");
        return;
    }

    try {
        const bookData = new FormData();

        // ✅ Append book type (important for backend)
        bookData.append("bookType", bookType);

        // ✅ Ensure original_price is stored as a number
        bookData.append("original_price", parseFloat(formData.original_price) || 0);

        // ✅ Append all form data properly
        Object.keys(formData).forEach((key) => {
            if (key === "images") {
                formData.images.forEach((file) => bookData.append("images", file));
            } else if (formData[key] !== undefined && formData[key] !== null) {
                bookData.append(key, formData[key]);
            }
        });

        // 🛠 Debug: Log FormData before sending
        console.log("📤 Sending FormData:");
        for (let pair of bookData.entries()) {
            console.log(pair[0], pair[1]);
        }

        // ✅ Send request to backend
        await addBook(bookData);
        alert("✅ Book Added Successfully!");
        onClose();
    } catch (error) {
        console.error("❌ Error adding book:", error.response?.data || error.message);
        alert(error.response?.data?.message || "❌ Failed to add book.");
    }
};

    return (
        <div className="modal">
            <div className="modal-content">
                {/* ✅ Step 1: Choose Book Type */}
                {step === 1 && (
                    <>
                        <h3>Add a Book</h3>
                        <button className="btn-primary" onClick={() => { setBookType("new"); setStep(2); }}>New Book</button>
                        <button className="btn-secondary" onClick={() => { setBookType("old"); setStep(2); }}>Old Book</button>
                        <button className="btn-close" onClick={onClose}>Cancel</button>
                    </>
                )}
                {/* ✅ Step 2: New Book (Single Page) */}
                {step === 2 && bookType === "new" && (
                    <form onSubmit={handleSubmit}>
                        <h3>Add New Book</h3>

                        <div className="form-grid">
                            <div>
                                <label>Title</label>
                                <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>Author</label>
                                <input type="text" name="author" value={formData.author} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>Genre</label>
                                <input type="text" name="genre" value={formData.genre} onChange={handleChange} />
                            </div>
                            <div>
                                <label>Price (₹)</label>
                                <input type="number" name="original_price" value={formData.original_price} onChange={handleChange} required />
                            </div>
                        </div>

                        <label>Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange}></textarea>

                        <label>Upload Images (2-5)</label>
                        <input type="file" multiple accept="image/*" onChange={handleImageUpload} />

                        <div className="image-preview">
                            {formData.images.map((img, index) => (
                                <div key={index} className="image-item">
                                    <img src={URL.createObjectURL(img)} alt="Preview" />
                                    <button type="button" onClick={() => removeImage(index)}>X</button>
                                </div>
                            ))}
                        </div>

                        <label className="checkbox-label">
                            <input type="checkbox" name="isRentable" checked={formData.isRentable} onChange={handleChange} />
                            Is Rentable?
                        </label>
                        {formData.isRentable && (
                            <>
                                <label>Rent Price (₹)</label>
                                <input type="number" name="rentPrice" value={formData.rentPrice} onChange={handleChange} />
                            </>
                        )}

                        <div className="form-grid">
                            <div>
                                <label>Condition</label>
                                <select name="condition" value={formData.condition} onChange={handleChange}>
                                    <option value="new">New</option>
                                    <option value="good">Good</option>
                                    <option value="average">Average</option>
                                    <option value="poor">Poor</option>
                                </select>
                            </div>
                            <div>
                                <label>Publication Date</label>
                                <input type="date" name="publicationDate" value={formData.publicationDate} onChange={handleChange} />
                            </div>
                        </div>

                        <button type="submit" className="btn-primary">Submit</button>
                        <button className="btn-close" onClick={onClose}>Cancel</button>
                    </form>
                )}

                {/* ✅ Step 2: Old Book - Initial Details */}
                {step === 2 && bookType === "old" && (
                    <form onSubmit={handleOldBookNext}>
                        <h3>Old Book Details</h3>

                        <div className="form-grid">
                            <div>
                                <label>Condition</label>
                                <select name="condition" value={formData.condition} onChange={handleChange}>
                                    <option value="new">New</option>
                                    <option value="good">Good</option>
                                    <option value="average">Average</option>
                                    <option value="poor">Poor</option>
                                </select>
                            </div>
                            <div>
                                <label>Publication Year</label>
                                <input type="number" name="publication_year" value={formData.publication_year} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>Original Price (₹)</label>
                                <input type="number" name="original_price" value={formData.original_price} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>Pages</label>
                                <input type="number" name="pages" value={formData.pages} onChange={handleChange} required />
                            </div>
                        </div>

                        <label>Upload Images</label>
                        <input type="file" multiple accept="image/*" onChange={handleImageUpload} />

                        <div className="image-preview">
                            {formData.images.map((img, index) => (
                                <div key={index} className="image-item">
                                    <img src={URL.createObjectURL(img)} alt="Preview" />
                                    <button type="button" onClick={() => removeImage(index)}>X</button>
                                </div>
                            ))}
                        </div>

                        <button type="button" className="btn-secondary" onClick={handlePredictPrice}>Predict Price</button>

                        <label>Predicted Price (₹)</label>
                        <input
                            type="text"
                            name="predictedPrice"
                            value={formData.predictedPrice || ""} // ✅ Ensure it shows correctly
                            readOnly
                        />


                        <label>
                            <input type="checkbox" name="acceptPredictedPrice" checked={formData.acceptPredictedPrice === "yes"} onChange={() => setFormData({ ...formData, acceptPredictedPrice: formData.acceptPredictedPrice === "yes" ? "no" : "yes" })} />
                            Accept Predicted Price?
                        </label>
                        {formData.acceptPredictedPrice === "no" && (
                            <>
                                <label>Custom Price (₹)</label>
                                <input type="number" name="customPrice" value={formData.customPrice} onChange={handleChange} />
                            </>
                        )}

                        <button type="submit" className="btn-primary">Next</button>
                        <button className="btn-close" onClick={onClose}>Cancel</button>
                    </form>
                )}

                {/* ✅ Step 3: Old Book - Full Book Details */}
                {step === 3 && bookType === "old" && (
                    <form onSubmit={handleSubmit}>
                        <h3>Complete Book Details</h3>

                        <label>Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required />

                        <label>Author</label>
                        <input type="text" name="author" value={formData.author} onChange={handleChange} required />

                        <label>Genre</label>
                        <input type="text" name="genre" value={formData.genre} onChange={handleChange} />

                        <label>Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange}></textarea>

                        <label className="checkbox-label">
                            <input type="checkbox" name="isRentable" checked={formData.isRentable} onChange={handleChange} />
                            Is Rentable?
                        </label>
                        {formData.isRentable && (
                            <>
                                <label>Rent Price (₹)</label>
                                <input type="number" name="rentPrice" value={formData.rentPrice} onChange={handleChange} />
                            </>
                        )}

                        <button type="submit" className="btn-primary">Submit</button>
                        <button className="btn-close" onClick={onClose}>Cancel</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AddBookModal;
