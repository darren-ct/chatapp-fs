const express = require("express");
const router = express.Router();
const {uploadFile} = require("../middleware/uploadFile");

const { unsendMessage } = require("../controllers/message");
const { getGroups, getInvitations,sendInvitation } = require("../controllers/group");
const { getUsers,getFriends,addFriend,changeDisplay,blockFriend,unblockFriend,getBirthdays } = require("../controllers/friend");
const { getChats } = require("../controllers/chat");
const { getProfile, getMyProfile, editMyProfile} = require("../controllers/profile");




// Message Related
router.use("/messages", require("./messages/messages.js")); 
router.use("/message", uploadFile("image") , require("./messages/message.js"));
router.delete("/unsend/:id", unsendMessage);


// Group related
router.get("/groups", getGroups) // see group list
router.use("/group", require("./groups/group"));
router.get("/invitations", getInvitations)       // invitation list
router.post("/invitation",sendInvitation)       // invite friend
router.use("/member", require("./members/member"))



// Friend related
router.get("/friends",getFriends) // friend list & bisa kirim body param isBlocked=true
router.post("/friend",addFriend) // add friend 
router.put("/friend/:id",changeDisplay)  // change friends display name
router.put("/block/:id",blockFriend) //block friend 
router.put("/unblock/:id",unblockFriend) // unblock friend
router.get("/users",getUsers)

// Chat related
router.get("/chats",getChats) // get all chats & bisa kirim body param isPinned = true
router.use("/chat",require("./chats/chat"));

// Others
router.get("/birthdays",getBirthdays) // get friends birthday

// Profile Related
router.get("/profile/:id",getProfile);
router.get("/myprofile",getMyProfile);
router.put("/myprofile", uploadFile("image"), editMyProfile);





module.exports = router;