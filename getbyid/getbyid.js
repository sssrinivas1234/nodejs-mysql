var express = require("express");
var router = express.Router();
var con = require("../db_connection");
var connection = con.getConnection();
var bcrypt = require("bcrypt");
var tok = require("../authentication");
var jwt = require("jsonwebtoken");

router.get("/:id", tok.verifyToken, (req, res) => {
    var taskId = req.params.id;
    connection.query(
        "SELECT * FROM tasks WHERE assignee_id = ?",
        [taskId],
        (err, result) => {
            if (err) {
                console.error("Error retrieving task:", err);
                return res.status(500).json({ "error": "Internal Server Error" });
            } else {
                if (result.length === 0) {
                    return res.status(404).json({ "error": "Task not found" });
                } else {
                    return res.status(200).json(result);
                }
            }
        }
    )}
)

module.exports = router;
