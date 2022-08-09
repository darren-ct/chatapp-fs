const {DataTypes} = require("sequelize");
const sequelize = require("../config/connect");

const GroupRoom = sequelize.define("group_room", {
    room_id : {
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    group_name : {
         type: DataTypes.STRING,
         allowNull:false,
    },
    url : {
        type: DataTypes.STRING,
        allowNull:false,
    },
    last_sent : {
        type: DataTypes.STRING,
    },
    description : {
        type:DataTypes.STRING,
    },
    image : {
        type:DataTypes.STRING,
    }
},{
    timestamps:true,
    freezeTableName:true
})

GroupRoom.sync()

module.exports = GroupRoom;