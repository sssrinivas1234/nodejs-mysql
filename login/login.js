var con = require("../db_connection");
var connection = con.getConnection();
connection.connect();
var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const secretKey = "your_secret_key_here";

router.post("/",(req, res) => {
    var username = req.body.username;
    var password = req.body.hash_password;

    // Retrieve hashed password from the database
    connection.query(
        "SELECT hash_password, id, role FROM employees WHERE username = ?",
        [username],
        (err, queryResult) => {
            if (err) {
                res.send({ "login": "Wrong password/username" });
            } 
            else 
            {
                if (queryResult.length > 0) {
                    bcrypt.compare(password, queryResult[0].hash_password, (err, result) => {
                        if (result) {
                            const userId = queryResult[0].id;
                            const roles = queryResult[0].role;
                            const token = jwt.sign({ id: userId, username: username,role:roles }, secretKey, { expiresIn: '1h' });
                            res.send({ "login": "Login Sucessfully!", "token": token });
                        } else {
                            res.send({ "login": "Wrong password/username" });
                        }
                    });
                } else {
                    res.send({ "login": "Wrong password/username" });
                }
            }
        }
    );
});

module.exports = router;
