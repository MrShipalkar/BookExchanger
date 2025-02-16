import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:5000/api", // Replace with your backend's base URL
    headers: {
        "Content-Type": "application/json",
    },
});

// Add interceptors if needed (e.g., for authentication tokens)
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default instance;
