const express = require("express");
const router = express.Router();

const { startChat, pinChat ,unpinChat } = require("../../controllers/chat");

router.post("/",startChat) // start chat
router.put("/unpin/:id",unpinChat) // pin chat
router.put("/pin/:id",pinChat) // pin chat

module.exports = router;