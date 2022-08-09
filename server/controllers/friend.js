const { QueryTypes } = require('sequelize');
const sequelize = require('../config/connect');
const {sendErr} = require("../helper/other");
const Profile = require('../models/Profile');
const UserFriend = require("../models/UserFriend");
const User = require("../models/User");

const getUsers = async(req,res) => {
    const userId = req.user.id;

    const query = `
    SELECT user.user_id ,user.username, profile.sahabat_id, profile_image , user_friend.user_id AS connection
    FROM user INNER JOIN profile
    ON user.user_id = profile.user_id AND user.user_id <> ${userId}
    LEFT JOIN user_friend
    ON user.user_id = user_friend.friend_id
    AND user_friend.user_id = ${userId};
    `;

    try {

        const users = await sequelize.query(query,{type:QueryTypes.SELECT});

        return res.status(201).send({
            status:"Success",
            data : {
                 users : users.map(user => { return {...user,profile_image:user.profile_image ? process.env.SERVER_URL + user.profile_image : null}})
            }
        });

    } catch(err) {
        console.log(err)
        sendErr("Server error",res)
    }

}

const getFriends = async(req,res) => {
 const userId = req.user.id;
 const isBlock = req.query.isBlock ;
 let query = null;

 if(!isBlock || isBlock === "false"){
  query = `
 SELECT friend_id , profile_image , user_friend.display_name , isBlock
 FROM user_friend INNER JOIN profile
 ON profile.user_id = user_friend.friend_id 
 AND user_friend.user_id = ${userId}
 ` } else {
    query = `
    SELECT friend_id , profile_image , user_friend.display_name 
    FROM user_friend INNER JOIN profile
    ON profile.user_id = user_friend.friend_id 
    AND user_friend.user_id = ${userId} AND isBlock = 'true'
    `
 };

 try {
    const friends = await sequelize.query(query,{type:QueryTypes.SELECT});

    return res.status(201).send({
        status: "Success",
        data : {
            friends : friends.map(friend => {return{
                ...friend,profile_image : friend.profile_image ? process.env.SERVER_URL + friend.profile_image : null
            }})
        }
    });


 } catch(err) {
    console.log(err)
    sendErr("Server error", res)
 }


};

const addFriend = async(req,res) => {
const userId = req.user.id;
const {friendId} = req.body;

try {
  const friend = await Profile.findOne({where : {
     user_id : friendId
  },attributes : ["display_name"]});

  if(!friend) {
    return sendErr("No user use that id",res)
  }

  await UserFriend.create({
    user_id : userId,
    friend_id : friendId,
    isBlock : "false",
    display_name : friend.display_name
  })

  return res.status(201).send({
    status : "Success"
  })

}catch(err){

    console.log(err);
   return sendErr("Server error",res)
};

};

const changeDisplay = async(req,res) => {
    const userId = req.user.id;
    const friendId = req.params.id;
    const {name} = req.body;

    try {
        await UserFriend.update({
            display_name : name
        },{
            where : {user_id : userId,friend_id:friendId}
        });

        return res.status(201).send({
           status : "Success"
        })

    } catch(err) {
        return sendErr("Server error",res)
    }
};

const blockFriend = async(req,res) => {
    const userId = req.user.id;
    const friendId = req.params.id;

    try {
        await UserFriend.update({
            isBlock : "true"
        },{
            where : {user_id : userId,friend_id:friendId}
        });

        return res.status(201).send({
            status : "Success"
         })

    } catch(err) {
        return sendErr("Server error",res)
    }
};

const unblockFriend = async(req,res) => {
    const userId = req.user.id;
    const friendId = req.params.id;


        try {
            await UserFriend.update({
                isBlock : "false"
            },{
                where : {user_id : userId,friend_id:friendId}
            });

            return res.status(201).send({
                status : "Success"
             })
    
        } catch(err) {
            return sendErr("Server error",res)
        }
   
};

const getBirthdays = async(req,res) => {

    const userId = req.user.id;

    try {
    const query = `
    SELECT friend_id , profile_image , user_friend.display_name , birth_date
    FROM user_friend INNER JOIN profile
    ON profile.user_id = user_friend.friend_id 
    AND user_friend.user_id = ${userId}`;  // pikirkan logic spy ambil yg recent 3 days

    const birthdays = await sequelize.query(query,{type:QueryTypes.SELECT});

    return res.status(201).send({
        status : "Success",
        birthdays : birthdays
     })

   } catch(err) {

    return sendErr("Server error",res)
   }


};

module.exports = {getBirthdays,getUsers,getFriends,addFriend,changeDisplay,blockFriend,unblockFriend}