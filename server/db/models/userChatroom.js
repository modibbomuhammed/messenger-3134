const { DataTypes, sequelize } = require("sequelize");
const db = require("../db");

const UserChatroom = db.define(
  "user_chatroom",
  {
    owner: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    lastestActive: {
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = UserChatroom;
