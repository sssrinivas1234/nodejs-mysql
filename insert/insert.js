var con = require("../db_connection");
var connection = con.getConnection();
connection.connect();
var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var tok = require("../authentication");
// Create table if not exists
connection.query(
    "CREATE TABLE IF NOT EXISTS employees (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) UNIQUE, hash_password VARCHAR(255), role VARCHAR(255))"
);


router.post("/", (req, res) => {
    var username = req.body.username;
    var password = req.body.hash_password;
    var role = req.body.role;
    // Hash the password
    bcrypt.hash(password, 100000000000, (err, hash) => { // Adjust the saltRounds according to your needs
        if (err) {
            res.send({ "insert": "fail" });
        } else {
            // const token = req.headers.authorization.split(" ")[1];
            // jwt.verify(token,'your_secret_key_here', (err, decoded) => {
                // if (err) {
                //     return res.status(401).json({ "error": "Unauthorized" });
                // } 
                // else
                // {
                //     const tokenInfo = decoded
                //     console.log(decoded)
                //     if(tokenInfo.role === 'USER'){
                //         res.status(403).json({ "error": "Users not able to create the tasks" });
                //     }
                // }
            // Insert username, hashed password, and role into the database
            connection.query(
                "INSERT INTO employees (username, hash_password, role) VALUES (?, ?, ?)",
                [username, hash, role], // Pass role as the third parameter
                (err, result) => {
                    if (err) {
                        res.send({ "insert": "fail" });
                    } else {
                        res.send({ "insert": "success" });
                    }
                }
            );
        // })
    }
    });
    
});






module.exports = router;
