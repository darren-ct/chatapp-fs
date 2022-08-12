const { QueryTypes } = require('sequelize');
const sequelize = require('../config/connect');
const {sendErr} = require("../helper/other");
const GroupRoom = require("../models/GroupRoom");
const UserGroup = require("../models/UserGroup");
const GroupMessage = require("../models/GroupMessage");

const fs = require('fs');
const path = require("path"); 

const Joi = require('joi');

require("dotenv").config();


// Groups
const getGroups = async(req,res) => {
     const userId = req.user.id;

     const query = `
     SELECT group_room.room_id, group_name, image
     FROM user_group INNER JOIN group_room
     ON group_room.room_id = user_group.room_id
     AND user_group.user_id = ${userId} AND status='Accepted'
     ORDER BY group_name ASC
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
    const userId = req.user.id;

    try {

        // Check the membership
        const myInfo = await UserGroup.findOne({
            where : {
                user_id:userId,
                room_id:roomId
            },
            attributes : ["roles"]
        });

        if(!myInfo){
            return sendErr("You are not inside the group",res)
        };

        // Find group info

        const profile = await GroupRoom.findOne({where:{room_id:roomId}});

        return res.status(201).send({
            status:"Success",
            data : {
                role : myInfo.roles,
                profile : {name : profile.group_name , description : profile.description, image : profile.image ? process.env.SERVER_URL + profile.image : null}
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
    

    try {
        // Check schema
        const schema = Joi.object({
           name: Joi.string()
           .min(3)
           .required(),
   
           description : Joi.string().min(8)
           
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
        if(req.file){
            const file = req.file.filename;

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
    
        } else {
            await GroupRoom.update({
                group_name : name,
                description : description,
           },{
               where : {
                    room_id : roomId
               }
           });
        };
        
        return res.status(201).send({
           "status" : "Success"
        })
       
        } catch(err) {
   
           console.log(err);
           return sendErr("Server error",res);
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
    await GroupMessage.destroy({where:{
        owner_id : userId,
        room_id : roomId
    }});

    return res.status(201).send({
        status : "Success"
    });

} catch(err) {
    console.log(err)
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
   const friendIds = req.body.friendIds;


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


        // Invite friends
        friendIds.forEach(async(friendId)=>{

            await UserGroup.create({
                room_id : roomId,
                user_id : friendId,
                roles : "Member",
                status : "Pending"
           })

        });
        

        return res.status(201).send({
            status : "Success"
        })

   } catch(err) {
    console.log(err)
    return sendErr("Server Error",res)
   }
}

// Member
const getMembers = async(req,res) => {
    const userId = req.user.id;
    const roomId = req.params.id;

    try {
         // Check the membership
        const myInfo = await UserGroup.findOne({
            where : {
                user_id:userId,
                room_id:roomId
            }
        });

        if(!myInfo){
            return sendErr("You are not inside the group",res)
        };

        // get Members
        const query = `
        SELECT user_friend.display_name AS display_name, user_group.roles , profile.display_name AS username , profile.profile_image , profile.user_id AS id
        FROM user_group INNER JOIN profile
        ON user_group.user_id = profile.user_id AND room_id = ${roomId} AND user_group.status <> "Pending"
        LEFT JOIN user_friend 
        ON profile.user_id = user_friend.friend_id AND user_friend.user_id = ${userId}
        `;

        const members = await sequelize.query(query,{type:QueryTypes.SELECT});

        res.status(201).send({
            status : "Success",
            data : {
                members : members.map(member => {return {...member,profile_image : member.profile_image ? process.env.SERVER_URL + member.profile_image : null}})
            }
        });



    } catch(err) {
        return sendErr("Server error",res)
    }
};

const getNonMembers = async(req,res) => {
    const userId = req.user.id;
    const roomId = req.params.id;

    console.log(roomId)

    try {
        // Check the membership
       const myInfo = await UserGroup.findOne({
           where : {
               user_id:userId,
               room_id:roomId
           }
       });

       if(!myInfo){
           return sendErr("You are not inside the group",res)
       };

       // get non members
       const query = `
       SELECT user_friend.display_name AS display_name, profile.display_name AS username , profile.profile_image , profile.user_id AS id , roles, status
       FROM profile INNER JOIN user_friend 
       ON profile.user_id = user_friend.friend_id AND user_friend.user_id = ${userId}
       LEFT JOIN user_group
       ON profile.user_id = user_group.user_id AND user_group.room_id = ${roomId} 
       WHERE status IS NULL OR status = "Declined"
       `;

       const nonMembers = await sequelize.query(query,{type:QueryTypes.SELECT});

       res.status(201).send({
           status : "Success",
           data : {
               nonMembers : nonMembers.map(nonmember => {return {...nonmember,profile_image : nonmember.profile_image ? process.env.SERVER_URL + nonmember.profile_image : null}})
           }
       });



   } catch(err) {
       return sendErr("Server error",res)
   }
};

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

};

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

};

const kickMember = async(req,res) => {
    const userId = req.user.id;
    const roomId = req.query.room;
    const friendId = req.query.id;

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

        await GroupMessage.destroy({
            where : {
                room_id : roomId,
                owner_id : friendId
            }
        });
    
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
    joinGroup, updateRoles, kickMember,getMembers,getNonMembers
}

