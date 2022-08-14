const UserChat = require("../models/UserChat");
const UserGroup = require("../models/UserGroup");
const ChatRoom = require("../models/ChatRoom")
const { QueryTypes } = require('sequelize');
const sequelize = require('../config/connect');
const {sendErr} = require("../helper/other");


const getChats = async(req,res) => {
    const userID = req.user.id;
    const isPinned = req.query.isPinned;

    let queryChat = "";
    let queryGroup = "";

    if(!isPinned){

     queryChat = `
    SELECT profile_image, isOnline , user_friend.display_name, user.user_id ,  chat_room.room_id, isPinned ,COUNT(message.room_id) AS notif , 
    TIME(MAX(message.createdAt)) AS last_time, DATE(MAX(message.createdAt)) AS last_date
    
    FROM user_chat INNER JOIN chat_room
    ON user_chat.room_id = chat_room.room_id AND user_chat.user_id = ${userID}

    INNER JOIN user
    ON user_chat.friend_id = user.user_id

    INNER JOIN profile
    ON user.user_id = profile.user_id

    INNER JOIN user_friend
    ON profile.user_id = user_friend.friend_id AND user_friend.user_id = ${userID}
    
    INNER JOIN message
    ON message.room_id = chat_room.room_id AND owner_id = ${userID} AND isRead = 'false' 

    GROUP BY message.room_id
    ORDER BY last_time, last_date ,isPinned DESC
    `;

     queryGroup = `
    SELECT image, group_name , group_room.room_id, isPinned ,COUNT(group_message.room_id) AS notif,
    TIME(MAX(group_message.createdAt)) AS last_time, DATE(MAX(group_message.createdAt)) AS last_date
 
    FROM user_group INNER JOIN group_room
    ON user_group.room_id = group_room.room_id AND user_group.user_id = ${userID}

    INNER JOIN group_message
    ON group_message.room_id = group_room.room_id AND owner_id = ${userID} AND isRead = 'false'

    GROUP BY group_message.room_id
    ORDER BY isPinned, last_time DESC
    `;

   
    } else {
       queryChat = `
       SELECT profile_image, isOnline, user_friend.display_name, user.user_id ,  chat_room.room_id ,COUNT(message.room_id) AS notif , 
       TIME(MAX(message.createdAt)) AS last_time, DATE(MAX(message.createdAt)) AS last_date
       
       FROM user_chat INNER JOIN chat_room
       ON user_chat.room_id = chat_room.room_id AND user_chat.user_id = ${userID} AND isPinned = 'true'
   
       INNER JOIN user
       ON user_chat.friend_id = user.user_id
   
       INNER JOIN profile
       ON user.user_id = profile.user_id
   
       INNER JOIN user_friend
       ON profile.user_id = user_friend.friend_id AND user_friend.user_id = ${userID}
       
       INNER JOIN message
       ON message.room_id = chat_room.room_id AND owner_id = ${userID} AND isRead = 'false' 
   
       GROUP BY message.room_id
       ORDER BY isPinned, last_time DESC
    `;
    queryGroup = `
    
    SELECT image, group_name , group_room.room_id ,COUNT(group_message.room_id) AS notif,
    TIME(MAX(group_message.createdAt)) AS last_time, DATE(MAX(group_message.createdAt)) AS last_date
 
    
    FROM user_group INNER JOIN group_room
    ON user_group.room_id = group_room.room_id AND user_group.user_id = ${userID} AND isPinned='true'

    INNER JOIN group_message
    ON group_message.room_id = group_room.room_id AND owner_id = ${userID} AND isRead = 'false'

    GROUP BY group_message.room_id
    ORDER BY isPinned, last_time DESC

    `;
    }

    try {
        let chats = await sequelize.query(queryChat,{type:QueryTypes.SELECT});
        let groupChats = await sequelize.query(queryGroup, {type:QueryTypes.SELECT});
       
        return res.status(201).send({
            status: "Success",
            data : {
                chats : chats.map(chat => {return {...chat,type:"single",profile_image : chat.profile_image ? process.env.SERVER_URL + chat.profile_image : null}}),
                groupChats : groupChats.map(group => {return {...group,type:"group",image : group.image ? process.env.SERVER_URL + group.profile_image : null}}),
                
            }
        });
    
    
     } catch(err) {
        console.log(err);
        sendErr("Server error", res)
     }
};

const startChat = async(req,res) => {
const userId = req.user.id;

const {friendId} = req.body;

try {

    // Check does previous room exist, if yes use that room
       const alreadyRoomed = await UserChat.findOne({
        where : {
             user_id : userId,
             friend_id : friendId
        },
        attributes : ["room_id"]
       })

       if(alreadyRoomed){

                   // send
         return res.status(201).send({
            status : "Success",
            id : alreadyRoomed.room_id
         })
       };

     // If dont, make new room
        const newRoom = await ChatRoom.create();

        await UserChat.create({
            user_id : userId,
            room_id : newRoom.room_id,
            friend_id : friendId
         });

                //send
         return res.send({
              status : "Success",
              id : newRoom.room_id
         });


} catch(err) {

    return sendErr("Server error",res)

};

};

const pinChat = async(req,res) => {
    const userId = req.user.id;
    const roomId = req.params.id;
    const {isGroup} = req.body;

    try {
        if(isGroup === "true"){
            await UserGroup.update({
                isPinned : "true"
            },{
                where : {
                    user_id : userId,
                    room_id : roomId
                }
            })
        } else {
            await UserChat.update({
                isPinned : "true"
            },{
                where : {
                    user_id : userId,
                    room_id : roomId
                }
            })
        };

        return res.status(201).send({
           status : "Success"
        });
    } catch(err) {
        sendErr("Server error",res)
    }
};

const unpinChat = async(req,res) => {
    const userId = req.user.id;
    const roomId = req.params.id;
    const {isGroup} = req.body;

    try {
        if(isGroup === "true"){
            await UserGroup.update({
                isPinned : "false"
            },{
                where : {
                    user_id : userId,
                    room_id : roomId
                }
            })
        } else {
            await UserChat.update({
                isPinned : "false"
            },{
                where : {
                    user_id : userId,
                    room_id : roomId
                }
            })
        };

        return res.status(201).send({
           status : "Success"
        });

    } catch(err) {
        sendErr("Server error",res)
    }
};

module.exports = {getChats,startChat,pinChat,unpinChat}