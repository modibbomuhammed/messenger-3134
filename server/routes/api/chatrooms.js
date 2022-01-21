const router = require("express").Router();
const { Chatroom, UserChatroom } = require("../../db/models");
const { Op } = require("sequelize");
const { getOnlineUserIds } = require("../../onlineUsers");

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)

router.get("/", async (req, res, next) => {
  try {
    const userChatRooms = await UserChatroom.findAll({
      where: { userId: req.user.id },
    });
    const userChatRoomsJSON = userChatRooms.map((chatroom) =>
      chatroom.toJSON()
    );
    let activeChats = await Chatroom.findAll({
      where: {
        [Op.or]: userChatRoomsJSON.map(({ chatroomId }) => ({
          id: chatroomId,
        })),
      },
    });

    activeChats = activeChats.map((chats) => {
      const chatJSON = chats.toJSON();
      const chat = userChatRoomsJSON.find(
        (chats) => chats.chatroomId === chatJSON.id
      );
      return { ...chat, chatroomName: chatJSON.name };
    });
    res.json(activeChats);
  } catch (error) {
    console.error(error);
  }
});

router.post("/create", async (req, res, next) => {
  try {
    const { chatRoomName } = req.body;

    const chatroom = await Chatroom.create({
      name: chatRoomName,
      chatUsers: [],
    });

    const userChatroom = await UserChatroom.create({
      owner: true,
      lastestActive:
        new Date().toISOString().split("T").join(" ").split("Z")[0] + " +00:00",
      chatroomId: chatroom.id,
      userId: req.user.id,
    });

    res.json({
      ...userChatroom.toJSON(),
      chatroomName: chatroom.toJSON().name,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
});

router.post("/join", async (req, res, next) => {
  try {
    const { id } = req.user;
    const { chatRoomId } = req.body;

    await UserChatroom.create({
      lastestActive:
        new Date().toISOString().split("T").join(" ").split("Z")[0] + " +00:00",
      chatroomId: chatRoomId,
      userId: id,
    });

    const room = await Chatroom.findOne({ where: { id: chatRoomId } });
    room.chatUsers = [...room.chatUsers, id];
    await room.save();
    res.json({ room }).sendStatus(204);
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
});

module.exports = router;
