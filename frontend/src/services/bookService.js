import api from "./apiConfig";

// ✅ Fetch books listed by the seller with token manually added
export const getBooksBySeller = async () => {
    try {
        const token = localStorage.getItem("token"); // ✅ Get token manually
        const response = await api.get("/books/seller/books", {
            headers: { "auth-token": token }, // ✅ Attach token manually
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching seller books:", error);
        throw new Error(error.response?.data?.message || "Failed to fetch books.");
    }
};

// ✅ Add a new book with token manually added
export const addBook = async (bookData) => {
    try {
        const token = localStorage.getItem("token");

        const response = await api.post("/books/seller/books", bookData, {
            headers: {
                "auth-token": token, 
                "Content-Type": "multipart/form-data", // ✅ Correctly set form encoding
            },
        });

        return response.data;
    } catch (error) {
        console.error("❌ Error adding book:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to add book.");
    }
};


// ✅ Update an existing book with token manually added
export const updateBook = async (bookId, bookData) => {
    try {
        const token = localStorage.getItem("token"); // ✅ Get token manually
        const response = await api.put(`/books/seller/books/${bookId}`, bookData, {
            headers: { "auth-token": token }, // ✅ Attach token manually
        });
        return response.data;
    } catch (error) {
        console.error("Error updating book:", error);
        throw new Error(error.response?.data?.message || "Failed to update book.");
    }
};

// ✅ Delete a book with token manually added
export const deleteBook = async (bookId) => {
    try {
        const token = localStorage.getItem("token"); // ✅ Get token manually
        const response = await api.delete(`/books/seller/books/${bookId}`, {
            headers: { "auth-token": token }, // ✅ Attach token manually
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting book:", error);
        throw new Error(error.response?.data?.message || "Failed to delete book.");
    }
};



// ✅ Predict Price for Old Books
export const predictBookPrice = async (bookDetails) => {
    try {
        const response = await api.post("/predict-price", bookDetails);
        
        console.log("📥 Full API Response:", response.data); // ✅ Debugging API Response

        return response.data.predicted_price; // Ensure it matches Flask API key
    } catch (error) {
        console.error("❌ Error predicting price:", error.response?.data || error.message);
        throw new Error(error.response?.data?.error || "Failed to predict price.");
    }
};

export const getAllBooks = async () => {
    try {
        const response = await api.get("/books/buyer/books");
        return response.data;
    } catch (error) {
        console.error("Error fetching books:", error);
        throw new Error(error.response?.data?.message || "Failed to fetch books.");
    }
};

export const getBookById = async (bookId) => {
    try {
        if (!bookId) throw new Error("Book ID is required"); // Prevent undefined bookId
        const response = await api.get(`/books/${bookId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching book:", error);
        throw new Error(error.response?.data?.message || "Failed to fetch book.");
    }
};

// ✅ Fetch similar books by bookId
export const getSimilarBooks = async (bookId) => {
    try {
        const response = await api.get(`/books/similar/${bookId}`);
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching similar books:", error.response?.data || error.message);
        if (error.response?.status === 404) {
            return []; // Return empty array if no similar books are found
        }
        throw new Error("Failed to fetch similar books.");
    }
};




// ✅ Fetch branches dynamically from the backend
export const getBranches = async () => {
    try {
        const response = await api.get("/books/branches"); // ✅ Fetch from backend
        return response.data.branches; // ✅ Return branches list
    } catch (error) {
        console.error("❌ Error fetching branches:", error.response?.data || error.message);
        return []; // Return an empty array in case of error
    }
};
