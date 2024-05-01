var con = require("../db_connection");
var connection = con.getConnection();
connection.connect();
var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
var tok = require("../authentication")
var jwt = require("jsonwebtoken"); 
// Create table if not exists
connection.query(
    "CREATE TABLE IF NOT EXISTS Tasks (id INT AUTO_INCREMENT PRIMARY KEY, title TEXT, description TEXT, status TEXT, assignee_id INT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(assignee_id) REFERENCES employees(id))",
    (err, result) => {
        if (err) {
            console.error("Error creating table:", err);
        } else {
            console.log("Table created or already exists");
        }
    }
);

router.post("/", tok.verifyToken, (req, res) => {
    var title = req.body.title;
    var description = req.body.description;
    var status = req.body.status;
    var assignee_id = req.body.assignee_id;

    const token = req.headers.authorization.split(" ")[1];
    
    // Decode the token
    jwt.verify(token, 'your_secret_key_here', (err, decoded) => {
        if (err) {
            return res.status(401).json({ "error": "Unauthorized" });
        } else {
            const tokenInfo = decoded;
            if (tokenInfo.role === 'USER') {
                return res.status(403).json({ "error": "User not able to create the tasks" });
            }

            // Insert task data into the database
            connection.query(
                "INSERT INTO Tasks (title, description, status, assignee_id) VALUES (?, ?, ?, ?)",
                [title, description, status, assignee_id],
                (err, result) => {
                    if (err) {
                        return res.status(500).json({ "error": "Failed to insert into database" });
                    } else {
                        return res.status(200).json({ "insert": "Task created Successfully!" });
                    }
                }
            );
        }
    });
});


module.exports = router;
