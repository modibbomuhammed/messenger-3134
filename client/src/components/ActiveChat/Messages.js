import React from "react";
import { Box, Avatar } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";

const useStyles = makeStyles(() => ({
  avatar: {
    height: 20,
    width: 20,
    marginTop: 6,
    marginLeft: "20%",
    float: "right",
  },
}));

const Messages = (props) => {
  const { messages, otherUser, userId, lastOtherUserMessage } = props;

  const classes = useStyles();

  return (
    <Box>
      {messages
        .sort((a, b) => a.id - b.id)
        .map((message) => {
          const time = moment(message.createdAt).format("h:mm");

          return message.senderId === userId ? (
            <SenderBubble key={message.id} text={message.text} time={time}>
              {message.id === lastOtherUserMessage.id && (
                <Avatar
                  alt={otherUser.username}
                  src={otherUser.photoUrl}
                  className={classes.avatar}
                />
              )}
            </SenderBubble>
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

export default Messages;
