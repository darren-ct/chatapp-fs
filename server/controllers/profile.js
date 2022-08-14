const { QueryTypes } = require('sequelize');
const sequelize = require('../config/connect');
const Profile = require("../models/Profile");
const UserChat = require("../models/UserChat");
const Joi = require('joi');

const {sendErr} = require("../helper/other")

const fs = require('fs');
const path = require("path"); 
const UserFriend = require("../models/UserFriend");


require("dotenv").config();

const getProfile = async(req,res) => {
    const MyId = req.user.id
    const roomId = req.params.id;

    try {
        const myFriend = await UserChat.findOne({
           where : {
              user_id : MyId,
              room_id : roomId
           },
           attributes : ["friend_id"]
        });

        if(!myFriend){
            return sendErr("Friend not found")
        }

        const myFriendId = myFriend.friend_id;

        const profile = await Profile.findOne({
            where : {
                user_id : myFriendId
            }
        });

        const userFriend = await UserFriend.findOne({
            where : {
                user_id : MyId,
                friend_id : myFriendId
            },
            attributes : ["display_name"]
        })

        if(!profile){
            return sendErr("Profile not found", res)
        };

        return res.status(201).send({
            status : "Success",
            data : {
                profile : {
                    id : profile.sahabat_id,
                    name : userFriend.display_name ,
                    number : profile.number ? profile.number : null,
                    image : profile.profile_image ? process.env.SERVER_URL + profile.profile_image : null,
                    caption : profile.caption ? profile.caption : null,
                    birth: profile.birth_date ? profile.birth_date : null,
                    last_online : profile.last_online
                }
            }
        })
    } catch(err) {
        console.log(err)
        return sendErr("Server error",res)
    }

};

const getMyProfile = async(req,res) => {
    const userId = req.user.id;
    const profileOnly = req.query.profileOnly

    try {

        // if profile only
        if(profileOnly){

            const profile = await Profile.findOne({
                where : {
                    user_id : userId
                },
                attributes : ["profile_image"]
            });

            if(!profile){
                return sendErr("Profile not found", res)
            };

            return res.status(201).send({
                status : "Success",
                data : {
                    profile : {
                        image : profile.profile_image ? process.env.SERVER_URL + profile.profile_image : null,
                    }
                }
            })

        };


        // if not profile
        const profile = await Profile.findOne({
            where : {
                user_id : userId
            }
        });

        if(!profile){
            return sendErr("Profile not found", res)
        };



        return res.status(201).send({
            status : "Success",
            data : {
                profile : {
                    id : profile.sahabat_id,
                    name : profile.display_name ,
                    number : profile.number ? profile.number : null,
                    image : profile.profile_image ? process.env.SERVER_URL + profile.profile_image : null,
                    caption : profile.caption ? profile.caption : null,
                    birth: profile.birth_date ? profile.birth_date : null,
                    last_online : profile.last_online
                }
            }
        })
    } catch(err) {
        return sendErr("Server error",err)
    }
};

const editMyProfile = async(req,res) => {
    const userId = req.user.id;
    const{name,number,caption,birth} = req.body;

    try {

        // Check format
        if(number && Number(number) === NaN){
            return sendErr("Phone must be a number",res)
        };
        const schema = Joi.object({
            name: Joi.string()
                .min(3)
                .required(),
        
            number: Joi.string().min(8),
        
            caption: Joi.string().min(8),
        
            birth: Joi.string().min(10)
        
        });
        await schema.validateAsync(req.body);

        // UPDATE
        if(req.file){

              const file = req.file.filename;

              // Update profile and delete old
              const oldProfile = await Profile.findOne({
                  where : {user_id:userId},
                  attributes : ["profile_image"]
              });

              await Profile.update({
                  profile_image : file,
                  display_name : name,
                  number : number,
                  caption : caption,
                  birth_date : birth,
              },{
                   where : {
                   user_id : userId
                   }
              });

              if(oldProfile.profile_image){
                   fs.unlink(path.join(__dirname,"..","uploads",oldProfile.profile_image),(err)=>{console.log(err)});
                };

                      } else {

              await Profile.update({
                display_name : name,
                number : number,
                caption : caption,
                birth_date : birth,
              },{
               where : {
                    user_id : userId
                 }
              });

            }


        // GET IMAGE
        const newProfile = await Profile.findOne({
            where : {
                user_id : userId
            },
            attributes : ["profile_image"]
        })

        return res.status(201).send({
            status : "Success",
            data : {
                image : newProfile.profile_image ? process.env.SERVER_URL + newProfile.profile_image : null
            }
        });

    } catch(err) {
        console.log(err);
        sendErr("Server Error", res);
    }
}

const editProfile = async(req,res) => {
    const MyId = req.user.id
    const roomId = req.params.id;
    const {name} = req.body;

    try {

        // Joi
        const schema = Joi.object({
            name: Joi.string()
                .min(3)
                .required(),
        });
        await schema.validateAsync(req.body);

        // Find friend id
        const myFriend = await UserChat.findOne({
            where : {
               user_id : MyId,
               room_id : roomId
            },
            attributes : ["friend_id"]
         });
 
         if(!myFriend){
             return sendErr("Friend not found")
         }
 
         const myFriendId = myFriend.friend_id;

        //  Update
        await UserFriend.update({display_name:name},{
            where : {
                user_id : MyId,
                friend_id : myFriendId
            }
        });

        const query = `
        SELECT profile_image , isOnline ,user_friend.display_name
        FROM profile INNER JOIN user_friend
        ON profile.user_id = user_friend.friend_id 
        AND user_friend.friend_id = ${myFriendId}
        AND user_friend.user_id = ${MyId}
        `;

        const profile = await sequelize.query(query,{type:QueryTypes.SELECT})

        return res.status(201).send({
           status : "Success",
           data : {
            profile : profile.map(item => {return {...item,profile_image : item.profile_image ? 
                process.env.SERVER_URL + item.profile_image : null }})[0]
           }

        })

        // 
        return res.status(201).send({
            status: "Success",
        })



    } catch (err) {

        sendErr("Server Error",res)
        console.log(err);

    }
}

module.exports.getProfile = getProfile;
module.exports.getMyProfile = getMyProfile;
module.exports.editMyProfile = editMyProfile;
module.exports.editProfile = editProfile;