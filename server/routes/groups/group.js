const express = require("express");
const router = express.Router();

const {uploadFile} = require("../../middleware/uploadFile")
const { getProfile, createGroup , editGroup , leaveGroup ,joinGroup } = require("../../controllers/group");

router.put("/join",joinGroup) //join group
router.get("/:id", getProfile) // see group profile
router.post("/", uploadFile("image") ,createGroup) //create group
router.put("/:id" , uploadFile("image"), editGroup) // edit group profile
router.delete("/:id" , leaveGroup) //leave group

module.exports = router;