const { QueryTypes } = require('sequelize');
const { Op } = require("sequelize");
const sequelize = require("../config/connect");

const Message = require("../models/Message");
const GroupMessage = require("../models/GroupMessage");
const UserChat = require("../models/UserChat");
const UserGroup = require("../models/UserGroup");

const {sendErr} = require("../helper/other");

const getMessages = async(req,res) => {
    const roomId = req.query.roomId;
    const isGroup = req.query.isGroup;
    const userId = req.user.id;

    let messageQuery = "";
    let profileQuery = "";


      try {

        // QUERY
        if(isGroup !== "true"){

            const friend = await UserChat.findOne({
                where : {
                      room_id:roomId,
                      [Op.or] : [
                            {user_id:userId},
                            {friend_id:userId}
                           ]
                        },
              attributes : ["friend_id","user_id"]
            });

            const friendId = friend.friend_id == userId ? friend.user_id : friend.friend_id;

            messageQuery = `
                 SELECT message_id, sender_id, body, replying, isRead, isForwarded, 
                 user_friend.display_name, profile_image,
                 DAYNAME(message.createdAt) AS day,
                 DATE(message.createdAt) AS date,
                 TIME(message.createdAt) AS time
        
                 FROM message INNER JOIN profile
                 ON message.sender_id = profile.user_id AND message.room_id = ${roomId} AND ( message.owner_id = ${userId} OR message.owner_id = 16 OR message.owner_id = 17)

                 LEFT JOIN user_friend
                 ON user_friend.friend_id = profile.user_id AND user_friend.user_id = ${userId}
                 ORDER BY message.createdAt ASC
                `;

            profileQuery = `
                  SELECT user_friend.display_name, profile_image, isOnline, 
                  DATE(last_online) AS date,
                  TIME(last_online) AS time

                  FROM profile INNER JOIN user_friend 
                  ON user_friend.friend_id = profile.user_id 
                  AND user_friend.friend_id = ${friendId} AND user_friend.user_id = ${userId}
                `; 

          } else {

             messageQuery = `
             SELECT message_id, sender_id, body, replying, isRead, isForwarded, 
             user_friend.display_name, profile_image, profile.display_name AS username,
             DATE(createdAt) AS date,
             TIME(createdAt) AS time,
             DAY(createdAt) AS day

             FROM group_message INNER JOIN profile
             ON group_message.sender_id = profile.user_id AND group_message.room_id = ${roomId} AND group_message.owner_id IN ( ${userId} , 16 , 17 )

             LEFT JOIN user_friend
             ON user_friend.friend_id = profile.user_id AND user_friend.user_id = ${userId}
             ORDER BY group_message.createdAt ASC
             `;

             profileQuery = `
             SELECT group_name, image
             FROM group_room WHERE
             room_id = ${roomId}
             `; 

          };

        // FETCH
        const messages = await sequelize.query(
           messageQuery , {type:QueryTypes.SELECT}
        );

        const profile = await sequelize.query(
          profileQuery, {type:QueryTypes.SELECT}
        );

        // RESPOND
        if(isGroup !== "true"){

            return res.status(201).send({
                 status : "Success",
                 data : {
                    profile : profile.map(item => {return {...item,profile_image : item.profile_image ? process.env.SERVER_URL + item.profile_image : null}}),
                     messages : messages.map(item => {return {...item,profile_image : item.profile_image ? process.env.SERVER_URL + item.profile_image : null}})
                  }
             });

        } else {

            return res.status(201).send({
                 status : "Success",
                 data : {
                     profile : profile.map(item => {return {...item,image : item.image ? process.env.SERVER_URL + item.image : null}}),
                     messages : messages.map(item => {return {...item,profile_image : item.profile_image ? process.env.SERVER_URL + item.profile_image : null}})
                  }
            }); 

        };

    }catch(err){
        sendErr("Server Error",res)
    }

}

// Group
const sendMessage = async(req,res) => {
      const userId = req.user.id;
      const {isGroup,roomId,message,replying,isForwarded} = req.body;

      try {

      if(isGroup !== "true"){
    
          // find friend id
          const friend = await UserChat.findOne({
            where : {room_id:roomId,user_id:userId},
            attributes : ["friend_id"]
          });

          const friendId = friend.friend_id;

          // check hak
          const isConnected = await UserChat.findAll({
            where : {user_id:userId, room_id:roomId, friend_id:friendId},
            attributes : ["user_id"]
          });

          if(isConnected.length === 0){
             return sendErr("Unauthorized",res)
          }

           // check opposition
          const connected = await UserChat.findAll({
               where : {user_id:friendId,room_id:roomId,friend_id:userId},
               attributes : ["user_id"]
           });

          if(connected.length === 0){
              await UserChat.create({
                   user_id : friendId,
                   room_id : roomId,
                   friend_id : userId
              })
          };

          // Check is it the first message of the day
          const now = new Date();
          const today = now.getDate();

          const query = `SELECT message.message_id FROM
          message 
          WHERE owner_id = 16 
          AND room_id = ${roomId}
          AND DAY(message.createdAt) = ${today}`;

          const timeBotMessages = await sequelize.query(
              query , {type:QueryTypes.SELECT}
          );

          //  BOT MESSAGE!!
          if(timeBotMessages.length === 0){
              await Message.create({
                   room_id : roomId,
                   sender_id : 16,
                   owner_id : 16,
                   body : now.getDate() + "/" +  ( now.getMonth() + 1 ) + "/" + now.getFullYear(),
                   isForwarded : "false"
              })
            }

           // Create 2 messages
          const newMsg =  await Message.create({
              room_id : roomId,
              sender_id : userId,
              owner_id : userId,
              body :  message ,
              replying:replying,
              isForwarded:isForwarded ? isForwarded : "false"
            });

          await Message.create({
              room_id : roomId,
              sender_id : userId,
              owner_id : friendId,
              body :  message ,
              replying:replying,
              refering:newMsg.message_id,
              isForwarded:isForwarded ? isForwarded : "false",
            });

      } else {

        // check hak
        const isConnected = await UserGroup.findAll({
          where : {user_id:userId,room_id:roomId,status:"Accepted"},
          attributes : ["user_id"]
        });

        if(isConnected.length === 0){
          return sendErr("Unauthorized",res)
        }

        // Check is it the first message of the day
        const now = new Date();
        const today = now.getDate();

        const query1 = `SELECT group_message.message_id FROM
        group_message WHERE owner_id = 16 
        AND room_id = ${roomId}
        AND DAY(group_message.createdAt) = ${today}`;

        const timeBotMessages = await sequelize.query(
          query1 , {type:QueryTypes.SELECT}
       );

        //  BOT MESSAGE!!
        if(timeBotMessages.length === 0){
           await GroupMessage.create({
              room_id : roomId,
              sender_id : 16,
              owner_id : 16,
              body : now.getDate() + "/" +  ( now.getMonth() + 1 ) + "/" + now.getFullYear(),
              isForwarded : "false"
           })
        }

         // send message
        const newMessage = await GroupMessage.create({
            room_id : roomId,
            sender_id : userId,
            owner_id : userId,
            body :  message ,
            replying:replying,
            isForwarded:isForwarded ? isForwarded : "false",
            isRead : 'true'
          })

        //   Loop it
        const query = `
        SELECT user_id FROM user_group 
        WHERE user_id <> ${userId} AND room_id = ${roomId} AND status='Accepted'
        `

        const members = await sequelize.query(
            query , {type:QueryTypes.SELECT}
         )

         members.forEach(async(member) => {

            await GroupMessage.create({
                room_id : roomId,
                sender_id : userId,
                owner_id : member.user_id,
                body :  message ,
                replying:replying,
                isForwarded:isForwarded ? isForwarded : "false",
                refering : newMessage.message_id
              });

         })

        };

        return res.status(201).send({
          status:"Success"
        });
  
      } catch(err) {
         sendErr("Server error",res)
      };


}

const deleteMessage = async(req,res) => {
  const userId = req.user.id;
  const {isGroup,messageId} = req.query; 

  try {

    if(isGroup !== "true"){
        await Message.destroy({where:{owner_id:userId,message_id:messageId}})

    } else {
        await GroupMessage.destroy({where:{owner_id:userId,message_id:messageId}})
    };

     return res.status(201).send({
        status:"Success"
      });

  } catch(err) {
     sendErr("Server error",res)
  }

}

const unsendMessage = async(req,res) => {
  const userId = req.user.id;
  const {isGroup,messageId} = req.query;

  try {
     if(isGroup === "true"){
         await GroupMessage.destroy({where:{sender_id:userId,message_id:messageId}});
         await GroupMessage.destroy({where:{sender_id:userId,refering:messageId}});

     } else {

        await Message.destroy({where:{sender_id:userId,message_id:messageId}});
        await Message.destroy({where:{sender_id:userId,refering:messageId}});
 
     };
      
       return res.status(201).send({
        status:"Success"
      });

      } catch(err) {
        sendErr("Server error",res)
     }

}

const clearMessages = async(req,res) => {
   const{isGroup, roomId} = req.query;
   const userId = req.user.id;

   try {

        if(isGroup !== "true"){

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
        };

         return res.status(201).send({
         status:"Success"
          });

       } catch(err) {
         sendErr("Server error",res)
       }
 
}

module.exports.getMessages = getMessages;
module.exports.sendMessage = sendMessage;
module.exports.deleteMessage = deleteMessage;
module.exports.unsendMessage = unsendMessage;
module.exports.clearMessages = clearMessages;
