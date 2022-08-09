const { QueryTypes } = require('sequelize');
const sequelize = require('../config/connect');
const {sendErr} = require("../helper/other");
const GroupRoom = require("../models/GroupRoom");
const UserGroup = require("../models/UserGroup");

const fs = require('fs');
const path = require("path"); 

const Joi = require('joi');
const Message = require('../models/Message');


require("dotenv").config();


// Groups
const getGroups = async(req,res) => {
     const userId = req.user.id;

     const query = `
     SELECT group_room.room_id, group_name, image
     FROM user_group INNER JOIN group_room
     ON group_room.room_id = user_group.room_id
     AND user_group.user_id = ${userId} AND status='Accepted'
     `;


     try {
        const groups = await sequelize.query(query,{type:QueryTypes.SELECT});

        return res.status(201).send({
            status: "Success",
            data : {
                groups : groups.map(group => {
                    return {...group,image: group.image ? process.env.SERVER_URL + group.image : null}
                })
            }
        });


     } catch(err) {
        sendErr("Server error", res)
     }

};

const getProfile = async(req,res) => {
    const roomId = req.params.id;

    try {

        const profile = await GroupRoom.findOne({where:{room_id:roomId}});

        return res.status(201).send({
            status:"Success",
            data : {
                profile : profile
            }
        })

    } catch(err) {
 
        sendErr("Server error",res)

    }
};

const createGroup = async(req,res) => {
     const userId = req.user.id;
     const{name,description,friends} = req.body;
     
     const file = req.file.filename;

     

     try {
     const schema = Joi.object({
        name: Joi.string()
        .min(3)
        .required(),

        description : Joi.string().min(8)
        
     });

     await schema.validateAsync({name,description}); 

     const groupRoom = await GroupRoom.create({
        group_name : name,
        url : (new Date().getTime()).toString(),
        description: description,
        image : file
     });

     await UserGroup.create({
         room_id : groupRoom.room_id ,
         user_id : userId ,
         roles : "Owner" ,
         status : "Accepted"
     })

     if(friends){
     const friendsArr = friends.split(",");
     

     if(friendsArr.length !== 0){
        // invite friends
        friendsArr.forEach(async(friend)=>{
            await UserGroup.create({
                room_id : groupRoom.room_id,
                user_id : friend,
                roles : "Member",
                status : "Pending"
           })
        })
     }

    };


     return res.status(201).send({
        "status" : "Success"
     })
    
    } catch(err) {

        console.log(err);
        return sendErr("Server error",res)
    
     }

};

const editGroup = async(req,res) => {
    const userId = req.user.id;
    const roomId = req.params.id;
    const{name,description} = req.body;
    const file = req.file.filename;

    try {
        // Check schema
        const schema = Joi.object({
           name: Joi.string()
           .alphanum()
           .min(3)
           .max(12)
           .required(),
   
           description : Joi.string().min(8).max(24)
           
        });
   
        await schema.validateAsync(req.body); 
   
        //Check user role
        const user =  await UserGroup.findOne({where : {
             room_id : roomId,
             user_id : userId
        }});

        if(!user || user.roles === "Member" || user.status !== "Accepted"){
            return sendErr( "Unauthorized",res)
        };

        // Update profile and delete old
        const oldGroup = await GroupRoom.findOne({
            where : {room_id:roomId},
            attributes : ["image"]
        });

        await GroupRoom.update({
            image : file,
            group_name : name,
            description : description,
       },{
           where : {
                room_id : roomId
           }
       });

       if(oldGroup.image){
        fs.unlink(path.join(__dirname,"..","uploads",oldGroup.image),(err)=>{console.log(err)})
       };

        return res.status(201).send({
           "status" : "Success"
        })
       
        } catch(err) {
   
           return sendErr("Server error",res)
        }
};

const leaveGroup = async(req,res) => {
const roomId = req.params.id;
const userId = req.user.id;

try {
    //  remove from user_group
     await UserGroup.destroy({where : {
          user_id : userId,
          room_id : roomId
     }});

    //  remove messages
    await Message.destroy({where:{
        owner_id : userId,
        room_id : roomId
    }});

    return res.status(201).send({
        status : "Success"
    });

} catch(err) {
    return sendErr("Server error",res)
}

};

// Invitation
const getInvitations = async(req,res) => {
const userId = req.user.id;

     try {

        const query = `
        SELECT image , group_name , group_room.room_id
        FROM group_room INNER JOIN user_group
        ON group_room.room_id = user_group.room_id 
        AND user_group.user_id = ${userId} AND user_group.status = 'Pending'
        `;
   
        const invitations = await sequelize.query(query,{type:QueryTypes.SELECT});

        return res.status(201).send({
            status : "Success",
            data : {
                invitations : invitations.map(invitation => {
                    return {...invitation,image: invitation.image ? process.env.SERVER_URL + invitation.image : null}
                })
            } 
        })


     } catch(err) {

          sendErr("Server error",res)
     }
}

const sendInvitation = async(req,res) => {
   const userId = req.user.id;
   const roomId = req.body.roomId;
   const friendId = req.body.friendId;

   try {
        const user = await UserGroup.findOne({
            where : {
                room_id : roomId,
                user_id : userId
            }
        });

        // Check roles
        if(user.roles === "Member" || !user){
            return sendErr("Unauthorized",res)
        };


        // Invite
        await UserGroup.create({
             room_id : roomId,
             user_id : friendId,
             roles : "Member",
             status : "Pending"
        })

        return res.status(201).send({
            status : "Success"
        })

   } catch(err) {
    return sendErr("Server Error",res)
   }
}

// Member
const joinGroup = async(req,res) => {
    const userId = req.user.id;
    const roomId = req.body.roomId;

    try {
        const user = await UserGroup.findOne({
            where : {
                room_id : roomId,
                user_id : userId
            }
        });

        // Check roles
        if(!user || user.status !== "Pending"){
            return sendErr("Unauthorized",res)
        };

        await UserGroup.update({
          status : "Accepted"
        },{where: {user_id:userId,room_id:roomId}})

        return res.status(201).send({
            status : "Success"
        })

   } catch(err) {
    console.log(err)
    return sendErr("Server Error",res)
   }

}

const updateRoles = async(req,res) => {
const userId = req.user.id;
const roomId = req.body.room_id;
const friendId = req.params.id;

try {

    // CHECK
    const user = await UserGroup.findOne({
        where : {
            room_id : roomId,
            user_id : userId
        }
    });

    const friend = await UserGroup.findOne({
        where : {
            room_id : roomId,
            user_id : friendId
        }
    });


    if(!user || user.roles === "Member"  ){
        return sendErr("Unauthorized", res)
    };

    if(!friend || friend.roles === "Owner" || friend.roles === "Admin" || friend.status !== "Accepted"  ){
        return sendErr("Member role update fail", res)
    };

    // UPDATE
    await UserGroup.update({
        roles : "Admin"
    },
        {where:{
            room_id : roomId,
            user_id : friendId
    }})

    return res.status(201).send({
        status : "Success"
    })


} catch(err) {
return sendErr("Server error",res)
 
}

}

const kickMember = async(req,res) => {
    const userId = req.user.id;
    const roomId = req.body.room_id;
    const friendId = req.params.id;

    try {

        // CHECK
        const user = await UserGroup.findOne({
            where : {
                room_id : roomId,
                user_id : userId
            }
        });
    
        const friend = await UserGroup.findOne({
            where : {
                room_id : roomId,
                user_id : friendId
            }
        });
    
    
        if(!user || user.roles === "Member"  ){
            return sendErr("Unauthorized", res)
        };
    
        if(!friend || friend.roles === "Owner"  ){
            return sendErr("Deletion fail", res)
        };
    
        // DELETE
        await UserGroup.destroy(
            {where:{
                room_id : roomId,
                user_id : friendId
        }})
    
        return res.status(201).send({
            status : "Success"
        })
    
    
    } catch(err) {
    return sendErr("Server error",res)
     
    }
};

module.exports = {
    getGroups,getProfile,createGroup,editGroup,leaveGroup,
    getInvitations,sendInvitation,
    joinGroup, updateRoles, kickMember
}

