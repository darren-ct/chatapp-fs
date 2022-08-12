const {DataTypes} = require("sequelize");
const sequelize = require("../config/connect");

const Message = sequelize.define("message", {
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
        allowNull:false
    },
    body : {
        type: DataTypes.STRING,
        allowNull:false,
    },
    replying : {
        type: DataTypes.INTEGER,

    },
    isRead : {
        type: DataTypes.STRING,
        allowNull:false,
        defaultValue : "false"
    },
    isForwarded : {
        type : DataTypes.STRING,
        allowNull: false}
    ,
    refering : {
        type: DataTypes.INTEGER,
    }


   
},{
    timestamps:true,
    freezeTableName:true
})

Message.sync()

module.exports = Message;