const {DataTypes} = require("sequelize");
const sequelize = require("../config/connect");

const GroupMessage = sequelize.define("group_message", {
    message_id : {
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement : true
    },
    room_id : {
        type: DataTypes.INTEGER,
        allowNull:false
    },
    sender_id : {
        type: DataTypes.INTEGER,
        
    },
    owner_id : {
        type: DataTypes.INTEGER,
        allowNull:false,

    },
    body : {
        type: DataTypes.STRING,
        allowNull:false,
    },
    replying : {
        type: DataTypes.INTEGER,

    },
    isForwarded : {
        type : DataTypes.STRING,
        allowNull: false
    },
    isRead : {
        type: DataTypes.STRING,
        allowNull:false
    },
    refering : {
        type : DataTypes.INTEGER
    }

   
},{
    timestamps:true,
    freezeTableName:true
})

GroupMessage.sync()

module.exports = GroupMessage;