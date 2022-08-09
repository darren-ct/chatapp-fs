const Message = require("../models/Message");
const GroupMessage = require("../models/GroupMessage");

const Chatroom = require("../models/ChatRoom");
const GroupRoom = require("../models/GroupRoom");

const UserChat = require("../models/UserChat");
const UserGroup = require("../models/UserGroup");

const sequelize = require("../config/connect");
const { QueryTypes } = require('sequelize');
const {sendErr} = require("../helper/other");



const getMessages = async(req,res) => {
    const roomId = req.body.roomId;
    const friendId = req.body.friendId;
    const isGroup = req.body.isGroup;
    const userId = req.user.id;
   

          if(!isGroup){

         const messageQuery = `
         SELECT message_id, sender_id  , body , replying , isRead , isForwarded , user_friend.display_name , profile_image
         HOUR(message.createdAt) AS hour,
         MINUTE(message.createdAt) AS minute,
         DAY(message.createdAt) AS day,
         MONTH(message.createdAt) AS month,
         YEAR(message.createdAt) AS year,
         FROM message INNER JOIN profile
         ON message.sender_id = profile.user_id AND message.room_id = ${roomId} AND message.owner_id = ${userId}
         INNER JOIN user_friend
         ON user_friend.friend_id = profile.user_id AND user_friend.user_id = ${userId}

         `;

          const profileQuery = `
          SELECT user_friend.display_name, profile_image, isOnline , updatedAt
          HOUR(last_online) AS hour,
          MINUTE(last_online) AS minute,
          DAY(last_online) AS day,
          MONTH(last_online) AS month,
          YEAR(last_online) AS year,
          FROM profile INNER JOIN user_friend 
          ON user_friend.friend_id = profile.user_id 
          AND user_friend.friend_id = ${friendId} AND user_friend.user_id = ${userId}
          `; 

        } else {

        const messageQuery = `
        SELECT message_id, sender_id  , body , replying , isRead , isForwarded , user_friend.display_name , profile_image
        HOUR(createdAt) AS hour,
        MINUTE(createdAt) AS minute,
        DAY(createdAt) AS day,
        MONTH(createdAt) AS month,
        YEAR(createdAt) AS year,
        FROM group_message INNER JOIN profile
        ON group_message.sender_id = profile.user_id AND group_message.message.room_id = ${roomId} AND group_message.owner_id = ${userId}
        INNER JOIN user_friend
        ON user_friend.friend_id = profile.user_id AND user_friend.user_id = ${userId}
    
        `;

        const profileQuery = `
        SELECT group_name, image
        FROM group_room WHERE
        room_id = ${roomId}
        `; 

        }

    try {
        const messages = await sequelize.query(
           messageQuery , {type:QueryTypes.SELECT}
        );

        const profile = await sequelize.query(
          profileQuery, {type:QueryTypes.SELECT}
        );

        return res.status(201).send({
           status : "Success",
           data : {
                profile : profile,
                messages : messages
           }
        })

    }catch(err){
        sendErr("Server Error",res)
    }

};

// Group
const sendMessage = async(req,res) => {
      const userId = req.user.id;
      const {isGroup,friendId,roomId,message,replying,isForwarded} = req.body;


      try {

       
      if(!isGroup){

        // check 
        const isConnected = await UserChat.find({
          where : {user_id:userId,room_id:roomId,friend_id:friendId}
        })

        if(isConnected.length === 0){
          return sendErr("Unauthorized",res)
        }


        // send message
        const connected = await UserChat.find({
          where : {user_id:friendId,room_id:roomId,friend_id:userId}
        });

        if(connected.length === 0){
          await UserChat.create({
                user_id : friendId,
                room_id : roomId,
                friend_id : userId
          })
        };


       await Message.create({
        room_id : roomId,
        sender_id : userId,
        owner_id : userId,
        body :  message ,
        replying:replying,
        isForwarded:isForwarded,
        isRead:"true"
      });

      await Message.create({
        room_id : roomId,
        sender_id : userId,
        owner_id : friendId,
        body :  message ,
        replying:replying,
        isForwarded:isForwarded,
        isRead: "false",
      });

      

      } else {

        // check
        const isConnected = await UserGroup.find({
          where : {user_id:userId,room_id:roomId,status:"Accepted"}
        });

        if(isConnected.length === 0){
          return sendErr("Unauthorized",res)
        }

        // send message
         const message = await GroupMessage.create({
            room_id : roomId,
            sender_id : userId,
            owner_id : userId,
            body :  message ,
            replying:replying,
            isForwarded:isForwarded
          });

        //   Loop it
        const query = `
        SELECT user_id FROM user_group 
        WHERE user_id <> ${userId} AND room_id = ${roomId}
        `

        const members = await sequelize.query(
            query , {type:QueryTypes.SELECT}
         );

         members.forEach(async(member) => {

            await GroupMessage.create({
                room_id : roomId,
                sender_id : userId,
                owner_id : member.user_id,
                body :  message ,
                replying:replying,
                isForwarded:isForwarded,
                refering : message.message_id
              });

         })

        }
  

        return res.status(201).send({
          status:"Success"
        });
  
      } catch(err) {
        return sendErr("Server error",res)
      };


};

const deleteMessage = async(req,res) => {
  const messageId = req.params.id;
  const userId = req.user.id;
  const {isGroup} = req.body; 

  try {

    if(!isGroup){
       await Message.destroy({where:{owner_id:userId,message_id:messageId}})

    } else {
        await GroupMessage.destroy({where:{owner_id:userId,message_id:messageId}})
    }

     return res.status(201).send({
        status:"Success"
      });

  } catch(err) {
    return sendErr("Server error",res)
  }

};

// Group
const unsendMessage = async(req,res) => {
  const messageId = req.params.id;
  const userId = req.user.id;
  const {isGroup} = req.body.isGroup;

  try {
     if(isGroup){
       await GroupMessage.destroy({where:{sender_id:userId,message_id:messageId}});
       await GroupMessage.destroy({where:{sender_id:userId,refering:messageId}});

     } else {

        await Message.destroy({where:{sender_id:userId,message_id:messageId}});
        await Message.destroy({where:{sender_id:userId,refering:messageId}});
 

     }
      
       return res.status(201).send({
        status:"Success"
      });

      } catch(err) {
        return sendErr("Server error",res)
     }

};

const clearMessages = async(req,res) => {
   const{isGroup, roomId} = req.body;
   const userId = req.user.id;

   try {
        if(!isGroup){

         await Message.destroy({
            where : {
                owner_id:userId,
                room_id : roomId
            }
         })

        } else {

            await GroupMessage.destroy({
                where : {
                    owner_id:userId,
                    room_id : roomId
                }
             })
        }

         return res.status(201).send({
         status:"Success"
          });

       } catch(err) {
         return sendErr("Server error",res)
       }
 
};

module.exports.getMessages = getMessages;
module.exports.sendMessage = sendMessage;
module.exports.deleteMessage = deleteMessage;
module.exports.unsendMessage = unsendMessage;
module.exports.clearMessages = clearMessages;