const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
require("dotenv").config();

module.exports = function(passport){
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback"
    }, async(accessToken, refreshToken , profile, done) => {

        const newUser = {
            username : profile.displayName,
            email : profile.email,
            isEmailVerified : "true"
        }
        // Store this profile in database and sesuai schema

        try {
             let user = await User.findOne({where : {email: profile.email}})

             if(user && user.isEmailVerified === "true"){

                 done(null,user);
             } else if (user && user.isEmailVerified === "false") {
                 await User.update({
                         username : profile.displayName,
                         email : profile.email,
                         isEmailVerified : "true",
                 },{where: {email: profile.email}})

                 done(null,newUser)
             } else {
                 await User.create(newUser)

                 done(null,newUser)
             }

        } catch(err) {
             console.error({Object})
        }
    }))

    // passport.serializeUser((user,done) => {
    //     done(null, user.id)
    // })

    // passport.deserializeUser((id, done) => {
    //     User.findById(id , (err,user) => {
    //         done(err,user)
    //     })
    // })
}