const jwt = require("jsonwebtoken");

module.exports = {
    verifyToken: (req, res, next) => {
        // Get auth header value
        const bearerHeader = req.headers["authorization"];
        // Check if bearer is undefined
        if (typeof bearerHeader !== "undefined") {
            // Split the bearerHeader
            const bearer = bearerHeader.split(" ");
            // Get token from array
            const bearerToken = bearer[1];
            // Set the token
            req.token = bearerToken;
            // Verify token
            jwt.verify(req.token, "your_secret_key_here", (err, authData) => {
                if (err) {
                    res.status(403).json({"error": "Invalid token"});
                } else {
                    // If token is valid, move to the next middleware
                    next();
                }
            });
        } else {
            res.status(403).json({"error": "Token required"});
        }
    }
};
