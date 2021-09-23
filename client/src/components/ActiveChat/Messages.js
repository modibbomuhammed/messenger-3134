import React from "react";
import { connect } from "react-redux";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const Messages = (props) => {
  const { messages, otherUser, userId } = props;
  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === userId ? (
          <SenderBubble key={message.id} text={message.text} time={time} />
        ) : (
          <OtherUserBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
          />
        );
      })}
    </Box>
  );
};

const mapStateToProps = (state) => {
  const convoUser = state.activeConversation;
  const { messages, otherUser } = state.conversations.find(
    (m) => m.otherUser.username === convoUser
  );
  const displayMessages = [...messages].reverse();
  const userId = state.user.id;
  return { messages: displayMessages, userId, otherUser };
};

export default connect(mapStateToProps)(Messages);
