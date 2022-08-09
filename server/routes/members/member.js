const express = require("express");
const router = express.Router();

const { joinGroup, updateRoles , kickMember } = require("../../controllers/group");

router.post("/",joinGroup)       // join group
router.put("/:id",updateRoles)    // edit member roles
router.delete("/:id",kickMember) // kick member

module.exports = router;