const {DataTypes} = require("sequelize");
const sequelize = require("../config/connect");

const UserChat = sequelize.define("user_chat", {
    room_id : {
        type: DataTypes.INTEGER,
        primaryKey : true
    },
    user_id : {
        type: DataTypes.INTEGER,
        primaryKey : true
    },
    friend_id : {
        type: DataTypes.INTEGER,
    },
    isPinned : {
        type: DataTypes.STRING,
        allowNull:false,
        defaultValue:"false"
    }
},{
    timestamps:false,
    freezeTableName:true
})

UserChat.sync()

module.exports = UserChat;