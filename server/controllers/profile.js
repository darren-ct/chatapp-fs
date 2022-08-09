const Profile = require("../models/Profile");
const Joi = require('joi');

const {sendErr} = require("../helper/other")

const fs = require('fs');
const path = require("path"); 


require("dotenv").config();

const getProfile = async(req,res) => {
    const userId = req.params.id;

    try {
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

        return res.status(201).send({
            status : "Success"
        });

    } catch(err) {
        console.log(err);
        sendErr("Server Error", res);
    }
}

module.exports.getProfile = getProfile;
module.exports.getMyProfile = getMyProfile;
module.exports.editMyProfile = editMyProfile;