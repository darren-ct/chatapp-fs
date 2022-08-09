const {DataTypes} = require("sequelize");
const sequelize = require("../config/connect");

const UserFriend = sequelize.define("user_friend", {
    user_id : {
        type: DataTypes.INTEGER,
        primaryKey:true
    },
    friend_id : {
        type: DataTypes.INTEGER,
        primaryKey:true
    },
    isBlock : {
        type: DataTypes.STRING,
        allowNull:false,
    },

    display_name : {
        type: DataTypes.STRING,
        allowNull:false
    }

},{
    timestamps:false,
    freezeTableName:true
})

UserFriend.sync()

module.exports = UserFriend;