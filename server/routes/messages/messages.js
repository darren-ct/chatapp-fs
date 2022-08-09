const express = require("express");
const router = express.Router();

const { getMessages, clearMessages } = require("../../controllers/message");

router.get("/", getMessages); // get messages list
router.delete("/", clearMessages) // clear chat


module.exports = router;