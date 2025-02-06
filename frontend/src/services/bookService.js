import api from "./apiConfig";

// Get books listed by the seller
export const getBooksBySeller = async () => {
    try {
        const response = await api.get("/api/seller/books"); // Ensure backend supports this route
        return response.data;
    } catch (error) {
        console.error("Error fetching seller books:", error);
        throw new Error(error.response?.data?.message || "Failed to fetch books.");
    }
};

// Add a new book
export const addBook = async (bookData) => {
    try {
        const response = await api.post("/api/seller/books", bookData);
        return response.data;
    } catch (error) {
        console.error("Error adding book:", error);
        throw new Error(error.response?.data?.message || "Failed to add book.");
    }
};

// Update an existing book
export const updateBook = async (bookId, bookData) => {
    try {
        const response = await api.put(`/api/seller/books/${bookId}`, bookData);
        return response.data;
    } catch (error) {
        console.error("Error updating book:", error);
        throw new Error(error.response?.data?.message || "Failed to update book.");
    }
};

// Delete a book
export const deleteBook = async (bookId) => {
    try {
        const response = await api.delete(`/api/seller/books/${bookId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting book:", error);
        throw new Error(error.response?.data?.message || "Failed to delete book.");
    }
};
