const express = require("express");
const router = express.Router();

const { sendMessage, deleteMessage,likeMessage} = require("../../controllers/message");

router.put("/like/:id",likeMessage)
router.post("/", sendMessage); // send message
router.delete("/:id", deleteMessage) // delete for me


module.exports = router;