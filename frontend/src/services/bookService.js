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
        const token = localStorage.getItem("token"); // ✅ Get token manually
        const response = await api.post("/books/seller/books", bookData, {
            headers: { "auth-token": token }, // ✅ Attach token manually
        });
        return response.data;
    } catch (error) {
        console.error("Error adding book:", error);
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
