const express = require("express");
const router = express.Router();

const { startChat, deleteChat , pinChat } = require("../../controllers/chat");

router.post("/",startChat) // start chat
router.delete("/:id",deleteChat) // delete chat
router.put("/:id",pinChat) // pin chat

module.exports = router;