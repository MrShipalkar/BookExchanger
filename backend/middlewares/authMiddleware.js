const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"]; // ✅ Ensure it's "authorization"
    
    if (!token || !token.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: Token is required" });
    }

    try {
        const actualToken = token.split(" ")[1]; // ✅ Extract token after "Bearer"
        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to request
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token", error });
    }
};

module.exports = { verifyToken };
