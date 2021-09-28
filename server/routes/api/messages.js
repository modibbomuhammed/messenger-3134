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
        unread: messageStatus ? false : true,
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
      unread: messageStatus ? false : true,
    });
    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

router.put("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    const { otherUser, conversationId, unreadMessagesCount } = req.body;
    const activeChat = onlineUsers.find((val) => val.id === req.user.id);
    activeChat
      ? (activeChat.activeConversation = otherUser.username)
      : onlineUsers.push({
          id: req.user.id,
          activeConversation: otherUser.username,
        });

    if (!conversationId || unreadMessagesCount === 0) return res.json({});

    const conversations = await Conversation.findOne({
      where: { id: conversationId },
      attributes: ["id"],
      order: [[Message, "createdAt", "DESC"]],
      include: [{ model: Message, order: ["createdAt", "DESC"] }],
    });

    const convoJSON = conversations.toJSON();
    let messagePromises = [];

    convoJSON.messages.forEach((values) => {
      if (values.unread) {
        messagePromises.push(
          Message.update({ unread: false }, { where: { id: values.id } })
        );
      }
    });
    await Promise.all(messagePromises);

    res.json({});
  } catch (err) {
    next(err);
  }
});

module.exports = router;
