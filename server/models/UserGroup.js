const {DataTypes} = require("sequelize");
const sequelize = require("../config/connect");

const UserGroup = sequelize.define("user_group", {
    room_id : {
        type: DataTypes.INTEGER,
        primaryKey : true
    },
    user_id : {
        type: DataTypes.INTEGER,
        primaryKey : true
    },
    roles : {
        type: DataTypes.STRING,
        allowNull:false
    },
    status : {
        type: DataTypes.STRING,
        allowNull:false,
    },
    isPinned : {
        type: DataTypes.STRING,
        allowNull:false,
        defaultValue:"false"
    },
    
},{
    timestamps:false,
    freezeTableName:true
})

UserGroup.sync()

module.exports = UserGroup;