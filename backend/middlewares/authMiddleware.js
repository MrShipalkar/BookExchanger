const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers["auth-token"]; // ✅ Ensure backend expects "auth-token"
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: Token is required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token", error });
    }
};

module.exports = { verifyToken };
