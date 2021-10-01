const { Sequelize, DataTypes } = require("sequelize");
const db = require("../db");

const Message = db.define("message", {
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  unread: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

module.exports = Message;
