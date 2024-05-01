var express = require("express");
var router = express.Router();
var con = require("../db_connection");
var connection = con.getConnection();
var bcrypt = require("bcrypt");
var tok = require("../authentication");
var jwt = require("jsonwebtoken");

router.put("/:id", tok.verifyToken, (req, res) => {
    var taskId = req.params.id;
    var { title, description, status, assignee_id } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, 'your_secret_key_here', (err, decoded) => {
        if (err) {
            return res.status(401).json({ "error": "Unauthorized" });
        } else {
            const tokenInfo = decoded;
            if (tokenInfo.role === 'USER') {
                return res.status(403).json({ "error": "Users not able to view the tasks" });
            } else {
                connection.query(
                    "UPDATE tasks SET title = ?, description = ?, status = ?, assignee_id = ? WHERE id = ?",
                    [title, description, status, assignee_id, taskId],
                    (err, result) => {
                        if (err) {
                            return res.status(500).json({ "error": "Internal Server Error" });
                        } else {
                            if (result.affectedRows === 0) {
                                return res.status(404).json({ "error": "Task not found" });
                            } else {
                                return res.status(200).json({ "message": "Task updated successfully" });
                            }
                        }
                    }
                );
            }
        }
    });
});

module.exports = router;
