const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const {
    getBooksBySeller,
    addBook,
    updateBook,
    deleteBook
} = require("../controllers/bookController");

const router = express.Router();

// ✅ Correct backend route (Matches frontend call)
router.get("/seller/books", verifyToken, getBooksBySeller);
router.post("/seller/books",verifyToken, upload.array("images", 5), addBook);
router.put("/seller/books/:id", verifyToken, updateBook);
router.delete("/seller/books/:id", verifyToken, deleteBook);

module.exports = router;
