const express = require("express");
const router = express.Router();

const { sendMessage, deleteMessage} = require("../../controllers/message");

router.post("/", sendMessage); // send message
router.delete("/:id", deleteMessage) // delete for me


module.exports = router;