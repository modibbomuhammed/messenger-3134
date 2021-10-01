const { DataTypes } = require("sequelize");
const db = require("../db");

const UserChatroom = sequelize.define("user_chatroom", {
  owner: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = UserChatroom;
