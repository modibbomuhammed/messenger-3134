const { DataTypes } = require("sequelize");
const db = require("../db");

const Chatroom = db.define("chatroom", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  chatUsers: {
    type: DataTypes.STRING,
    allowNull: false,
    get() {
      return this.getDataValue("chatUsers").split(",");
    },
    set(val) {
      this.setDataValue("chatUsers", val.join(","));
    },
  },
});

module.exports = Chatroom;
