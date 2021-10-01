const { DataTypes } = require("sequelize");
const db = require("../db");

const Chatroom = db.define("chatroom", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Chatroom;
