const {DataTypes} = require("sequelize");
const sequelize = require("../config/connect");

const ChatRoom = sequelize.define("chat_room", {
    room_id : {
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    last_sent : {
        type: DataTypes.STRING,
    }
},{
    timestamps:true,
    freezeTableName:true
})

ChatRoom.sync()

module.exports = ChatRoom;