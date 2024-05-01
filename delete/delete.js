var express = require("express");
var router = express.Router();
var con = require("../db_connection");
var connection = con.getConnection();
var bcrypt = require("bcrypt");
var tok = require("../authentication")
var jwt = require("jsonwebtoken");

router.delete("/:id", tok.verifyToken, (req, res) => {
    var taskId = req.params.id;
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, 'your_secret_key_here', (err, decoded) => {
        if (err) {
            return res.status(401).json({ "error": "Unauthorized" });
        } else {
            const tokenInfo = decoded;
            if (tokenInfo.role === 'USER') {
                return res.status(403).json({ "error": "User not able to delete the tasks" });
            } else {
                connection.query(
                    "DELETE FROM tasks WHERE id = ?",
                    [taskId],
                    (err, result) => {
                        if (err) {
                            return res.status(500).json({ "error": "Internal Server Error" });
                        } else {
                            if (result.affectedRows === 0) {
                                return res.status(404).json({ "error": "Task not found" });
                            } else {
                                return res.status(200).json("Deleted Successfully!");
                            }
                        }
                    }
                );
            }
        }
    });
});

module.exports = router;
