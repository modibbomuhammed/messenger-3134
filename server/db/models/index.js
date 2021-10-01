const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const Chatroom = require("./chatroom");
// associations

User.hasMany(Conversation);
Conversation.belongsTo(User, { as: "user1" });
Conversation.belongsTo(User, { as: "user2" });
Chatroom.hasMany(Message);
Message.belongsTo(Chatroom);
Message.belongsTo(Conversation);
Conversation.hasMany(Message);
Chatroom.belongsToMany(User, { through: "user_chatroom" });
User.belongsToMany(Chatroom, { through: "user_chatroom" });

module.exports = {
  User,
  Conversation,
  Message,
  Chatroom,
};
