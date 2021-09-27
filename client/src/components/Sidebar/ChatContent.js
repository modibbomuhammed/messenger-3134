import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Badge from "@material-ui/core/Badge";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
  },
  messages: {
    right: "30px",
    top: "10px",
  },
}));

const ChatContent = (props) => {
  const classes = useStyles();

  const { conversation } = props;
  const { latestMessageText, otherUser } = conversation;

  const numberOfUnreadMessages = conversation.messages.filter(
    (val) => val.unread
  ).length;

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={classes.previewText}>
          {latestMessageText}
        </Typography>
      </Box>

      {numberOfUnreadMessages > 0 ? (
        <Box>
          <Badge
            badgeContent={numberOfUnreadMessages}
            className={classes.messages}
            color="primary"
          ></Badge>
        </Box>
      ) : null}
    </Box>
  );
};

export default ChatContent;
