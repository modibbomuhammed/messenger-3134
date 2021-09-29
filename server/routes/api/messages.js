const router = require("express").Router();
const { Conversation, Message, User } = require("../../db/models");
const { onlineUsers, getOnlineUserIds } = require("../../onlineUsers");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;
    const foundUser = onlineUsers.find((val) => val.id === recipientId);
    const activeConversation = foundUser ? foundUser.activeConversation : "";

    const messageStatus = activeConversation === req.user.username;

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {
      const message = await Message.create({
        senderId,
        text,
        conversationId,
        unread: !messageStatus,
      });

      return res.json({ message, sender });
    }
    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (getOnlineUserIds().includes(sender.id)) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
      unread: !messageStatus,
    });

    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

router.put("/read", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    const { otherUser, conversationId, unreadMessagesCount } = req.body;
    const activeChat = onlineUsers.find((val) => val.id === req.user.id);
    activeChat
      ? (activeChat.activeConversation = otherUser)
      : onlineUsers.push({
          id: req.user.id,
          activeConversation: otherUser,
        });

    if (!conversationId || unreadMessagesCount === 0) {
      return res.sendStatus(204);
    }

    const unreadMessages = await Message.findAll({
      where: { conversationId, unread: true },
    });
    const { senderId } = unreadMessages[0].dataValues;
    if (req.user.id !== senderId)
      await Message.update({ unread: false }, { where: { conversationId } });

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
