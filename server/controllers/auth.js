const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const User = require("../models/User");
const Profile = require("../models/Profile");
const { Op } = require("sequelize");

const {emailChecker,minimumChecker} = require("../helper/auth");
const {sendErr} = require("../helper/other")

require("dotenv").config();

// Registering
const registerUser = async(req,res) => {


    // Checking format
    if(!emailChecker(req.body.email) || !minimumChecker(req.body.email,8)){
        return sendErr("Email format invalid",res)
    };

    if(!minimumChecker(req.body.username,4)){
        return sendErr("Username minimum 4 characters",res)
    };

    if(!minimumChecker(req.body.password,8)){
        return sendErr("Password minimum 8 characters",res)
    };


    try {
        // Check any duplicate emails and username
        const duplicate = await User.findOne({
            where: {
                [Op.or]: [
                    {email: req.body.email},
                    {username: req.body.username }
                ]
            },
            attributes:["user_id"]
        })

        if(duplicate){
            return sendErr("Username/email is already registered",res)
        };

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,salt)
    
        const newUser = await User.create({
            username: req.body.username,
            email:req.body.email,
            password: hashedPassword,
            active_code : Math.floor(1000 + Math.random() * 9000), 
        });

        // Reset if..
        setTimeout(async()=>{
            const user = await User.findOne({
                where : {email:req.body.email}
            });

            if(!user){
                return;
            }

            if(user.active_code){
               await User.update({
                active_code : null
               },{where:{user_id: user.user_id}})
            }

            console.log("Active code nulled")

        },60000)

        setTimeout(async()=>{

            
            const user = await User.findOne({
                where : {email:req.body.email}
            });

            if(!user){
                return;
            }

            if(user.isEmailVerified === "false"){
                await User.destroy({where:{user_id:user.user_id}})
            };

            console.log("Deleted")
        },600000)


        // Kalo lolos semua, buat verifikasi kode lalu kirim ke email user
        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth : {
                user: process.env.SYSTEM_EMAIL,
                pass: process.env.SYSTEM_PASSWORD
            },
            tls : {
                rejectUnauthorized:false
            }
        })

        const mailOptions = {
            from: process.env.SYSTEM_EMAIL,
            to: newUser.email,
            subject: "Verify email",
            text : "Please verify your email",
            html : `
            <!doctype html>
            <html lang="en">
            <head>

            </head>
            <body>
                  <div>Enter this code to the website to validate your email</div>
                  <span> ${newUser.active_code} </span>
                  <p> This code only works for 1 minute </p>
            </body>
            </html>
            `
        }

        transporter.sendMail(mailOptions, (err,info)=>{
            if(err) throw err;

            return res.send({
                status:"Success",
                message: "Email sent!"
            });


        })
    

    } catch (err) {

        console.log(err)
        return sendErr("Server error",res)

    }

};

const resendCode = async(req,res) => {
    const {email} = req.body;

    try {

       // Find email
       const user = await User.findOne({
           where : {email : email}
       })

       // Check
       if(!user) {
           return sendErr("Email isn't registered yet",res)
       };

       if(user.active_code){
           return sendErr("Wait for several seconds before resending",res)
       }

       // Update
       await User.update({
           active_code : Math.floor(1000 + Math.random() * 9000)
       },{ 
            where : {
               email : email
            }
       });

       // Timer
       setTimeout(async()=>{
           const user = await User.findOne({
               where : {email:email}
           });

           if(user.active_code){
              await User.update({
               active_code : null
              },{where:{user_id: user.user_id}})
           }

       },60000);

       // Ambil code
       const newUser = await User.findOne({
           where : {email:email},
           attributes : ["active_code"]
       })

       if(!newUser){
           return sendErr("Server error",res)
       }

       // Send email
        // Kalo lolos semua, buat verifikasi kode lalu kirim ke email user
        const transporter = nodemailer.createTransport({
           service:"gmail",
           auth : {
               user: process.env.SYSTEM_EMAIL,
               pass: process.env.SYSTEM_PASSWORD
           },
           tls : {
               rejectUnauthorized:false
           }
       })

       const mailOptions = {
           from: process.env.SYSTEM_EMAIL,
           to: email,
           subject: "Verify email",
           text : "Please verify your email",
           html : `
           <!doctype html>
           <html lang="en">
           <head>

           </head>
           <body>
                 <div>Enter this code to the website to validate your email/password reset</div>
                 <span> ${newUser.active_code} </span>
                 <p> This code only works for 1 minute </p>
           </body>
           </html>
           `
       }

       transporter.sendMail(mailOptions, (err,info)=>{
           if(err) throw err;

           return res.send({
               status:"Success",
               message: "Email sent!"
           });


    })
   
   } catch(err) {
      return sendErr("Server error",res)
    }


};

const checkEmail = async(req,res) => {
   const code = req.params.code;
   const {email} = req.body;

   try{

   // Find assigned user
   const newUser = await User.findOne({where:{
       email : email
   },
   attributes : ["email","user_id","username","active_code"]
});
7
   if(!newUser){
       return sendErr("Email isn't registered yet",res);
   }



   // Check if token match
   if(newUser.active_code != code){
       return sendErr("Code doesnt match",res)
   };

   // if match, update user + add profile
   await User.update({
       isEmailVerified : "true",
       active_code : null
   },{where:{email:email}})

   //if profile dont exist yet,create
   const profile = await Profile.findOne({where:{
    user_id : newUser.user_id
   }})

   if(!profile){

   await Profile.create({
       user_id : newUser.user_id,
       display_name : newUser.username,
       isOnline : "true",
       last_online : null
   })  }

   // Create token + response

   const token = jwt.sign({
      id: newUser.user_id,
      iat: Date.now(),
      expires : "1d"
   }, process.env.SECRET,
   {
       expiresIn:"1d"
   })

   return res.status(201).send({
        status:"Success",
        data : {
           user : {
               user_id : newUser.user_id,
               name : newUser.username,
               email : newUser.email,
               token : token,
           }
        }
   })

       } catch(err) {

           console.log(err)
           sendErr("Server error",res)
       }


}

// Login
const loginUser = async(req,res) => {
    const{email,password} = req.body;


 try{
    //  check apakah email terdaftar
    const match = await User.findOne({
        where: {
            email : email
        } 
    });

    console.log(match.user_id)

    if(!match){
        return sendErr("Email not yet registered",res)
    };


    
    // check input passwordnya
    const matchedPw = match.password;
    const isMatch = bcrypt.compareSync(password,matchedPw);

    if(!isMatch){
        return sendErr("Wrong password",res)
    }


    // kasi token
    const token = jwt.sign({
        id : match.user_id,
        iat: Date.now(),
        expires : "1d"
     }, process.env.SECRET,
     {
         expiresIn:"1d"
     })

    // response
    return res.status(201).send({
        status:"Success",
        data : {
            user : {
                user_id : match.user_id,
                name: match.username,
                email: match.email ,
                token : token,
                isAdmin: match.isAdmin
            }
        }
    }) 

     } catch (err) {

        return sendErr("Email not Found",res)

    }

};

    // send code pakai "resendCode"


    // verif. kode ke "checkEmail"
            //  kalau lulus dpt token lalu redirect client ke resetpassword page

const resetPassword = async(req,res) => {
const email = req.user.email;
const {password} = req.body;

if(!minimumChecker(password,8)){
    return sendErr("Password minimum 8 characters",res)
};


try {
    const user = await User.findOne({
        where : {email:email},
        attributes : ["email"]
    });

    if(!user){
        sendErr("Email isnt found",res)
    };

    // Update
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt)
    
    await User.update({
        password:hashedPassword
    },{
        where : {
            email : email
        }
    })

    return res.status(201).send({
        status:"Success"
    })



} catch(err) {
     return sendErr("Server Error",res)
}
}

const logoutUser = async(req,res) => {
    return res.status(201).send({
        status:"Success",
        message: "Logged out"
    })
};


module.exports = {checkEmail, resendCode,registerUser, loginUser, logoutUser , resetPassword};