const {DataTypes} = require("sequelize");
const sequelize = require("../config/connect");

const Profile = sequelize.define("profile", {
    user_id : {
        type: DataTypes.INTEGER,
        unique:true,
        allowNull:false
    },
    sahabat_id : {
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    display_name : {
        type: DataTypes.STRING,
        allowNull:false,
    },

    number : {
        type: DataTypes.STRING,
        
    },

    profile_image : {
        type: DataTypes.STRING,
        
    },

    caption : {
        type: DataTypes.STRING,
        
    },

    birth_date : {
        type: DataTypes.DATE,
        
    },

    isOnline : {
        type : DataTypes.STRING,
        allowNull:false
    }, 

    last_online : {
        type: DataTypes.TIME,
        
    }, 



},{
    timestamps:false,
    freezeTableName:true
})

Profile.sync()

module.exports = Profile;