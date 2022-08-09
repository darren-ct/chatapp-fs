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
    SELECT profile_image, user_friend.display_name, user.user_id ,  chat_room.room_id, isPinned ,COUNT(message.room_id) ,MAX(message.createdAt) AS last_time,
    chat_room.updatedAt
   

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
    ORDER BY isPinned, last_time DESC
    `;

    // HOUR(chat_room.updatedAt) AS hour,
    // MINUTE(chat_room.updatedAt) AS minute,
    // DAY(chat_room.updatedAt) AS day,
    // MONTH(chat_room.updatedAt) AS month,
    // YEAR(chat_room.updatedAt) AS year

     queryGroup = `
    SELECT image, group_name , group_room.room_id, isPinned ,COUNT(group_message.room_id),MAX(group_message.createdAt) AS last_time,
    group_room.updatedAt
    
    FROM user_group INNER JOIN group_room
    ON user_group.room_id = group_room.room_id AND user_group.user_id = ${userID}

    INNER JOIN group_message
    ON group_message.room_id = group_room.room_id AND owner_id = ${userID} AND isRead = 'false'

    GROUP BY group_message.room_id
    ORDER BY isPinned, last_time DESC
    `;

    // HOUR(group_room.updatedAt) AS hour,
    // MINUTE(group_room.updatedAt) AS minute,
    // DAY(group_room.updatedAt) AS day,
    // MONTH(group_room.updatedAt) AS month,
    // YEAR(group_room.updatedAt) AS year

    // const lastChatQuery = `
    // SELECT body
    // FROM user_chat INNER JOIN message
    // ON user_chat.room_id = message.room_id 
    // AND user_chat.user_id = ${userID} AND message.owner_id = ${userID}
    // ORDER BY DESC
    // GROUP BY message.room_id
    // ORDER BY isPinned,group_room.updatedAt DESC

    // `

    // const lastGroupQuery = `
    // SELECT body
    // FROM user_group INNER JOIN group_message
    // ON user_group.room_id = group_message.room_id 
    // AND user_group.user_id = ${userID} AND group_message.owner_id = ${userID}

    // GROUP BY group_message.room_id
    // ORDER BY group_message.createdAt DESC
    // `
    } else {

       queryChat = `
    SELECT profile_image, user_friend.display_name, user.user_id ,  chat_room.room_id, isPinned ,COUNT(message.room_id) ,MAX(message.createdAt) AS last_time,
    chat_room.updatedAt
   

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
    
    SELECT image, group_name , group_room.room_id, isPinned ,COUNT(group_message.room_id),MAX(group_message.createdAt) AS last_time,
    group_room.updatedAt
    
    FROM user_group INNER JOIN group_room
    ON user_group.room_id = group_room.room_id AND user_group.user_id = ${userID} AND isPinned='true'

    INNER JOIN group_message
    ON group_message.room_id = group_room.room_id AND owner_id = ${userID} AND isRead = 'false'

    GROUP BY group_message.room_id
    ORDER BY isPinned, last_time DESC
    
    `;
    }

    try {
        const chats = await sequelize.query(queryChat,{type:QueryTypes.SELECT});
        // const recentList =  await sequelize.query(lastChatQuery,{type:QueryTypes.SELECT});

        const groupChats = await sequelize.query(queryGroup, {type:QueryTypes.SELECT});
        // const recentGroupList  =  await sequelize.query(lastGroupQuery,{type:QueryTypes.SELECT})
    
        return res.status(201).send({
            status: "Success",
            data : {
                chats : chats,
                // last_sent_chat : recentList,
                groupChats : groupChats,
                // last_sent_group_chat : recentGroupList,
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

        const room = await ChatRoom.create();

        await UserChat.create({
            user_id : userId,
            room_id : room.room_id,
            friend_id : friendId
         });

    return res.send({
        status : "Success"
    })


} catch(err) {

    return sendErr("Server error",res)

};

};

const deleteChat = async(req,res) => {
    const userId = req.user.id;

    const {isGroup,roomId,friendId} = req.body;

    try {

        if(isGroup){

        } else {
 
        }

        return res.status(201).send({
            status : "Success"
        })

    } catch(err) {

        sendErr("Server error",res)
    }
};

const pinChat = async(req,res) => {
    const userId = req.user.id;

    const {isGroup,roomId,friendId} = req.body;

    try {
        if(isGroup){
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
                    room_id : roomId,
                    friend_id : friendId
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

module.exports = {getChats,startChat,deleteChat,pinChat}