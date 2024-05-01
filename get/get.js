var express = require("express");
var router = express.Router();
var con = require("../db_connection");
var tok = require("../authentication");
var connection = con.getConnection();
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken"); // Import jsonwebtoken library

router.get("/", tok.verifyToken, (req, res) => {
    // Get the token from the request headers
    const token = req.headers.authorization.split(" ")[1];
    
    // Decode the token
    jwt.verify(token,'your_secret_key_here', (err, decoded) => {
        if (err) {
            return res.status(401).json({ "error": "Unauthorized" });
        } 
        else
        {
            const tokenInfo = decoded
            if(tokenInfo.role === 'USER'){
                res.status(403).json({ "error": "Users not able to view the tasks" });
            }

            connection.query(
                "SELECT * FROM tasks",
                (err, result) => {
                    if (err) {
                        res.status(500).json({ "error": "Internal Server Error" });
                    } else {
                        if (result.length === 0) {
                            res.status(404).json({ "error": "Task not found" });
                        } else {
                            res.status(200).json(result);
                        }
                    }
                }
            );
        }
    });
});

module.exports = router;
