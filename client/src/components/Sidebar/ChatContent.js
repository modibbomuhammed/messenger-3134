import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Badge from "@material-ui/core/Badge";
import { connect } from "react-redux";

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
  previewText: (prop) => ({
    fontSize: 12,
    color: prop.weight ? "#000000" : "#9CADC8",
    letterSpacing: -0.17,
    fontWeight: prop.weight ? 700 : 100,
  }),
  messages: {
    right: "30px",
    top: "10px",
  },
}));

const ChatContent = (props) => {
  const { conversation, userId } = props;
  const { latestMessageText, otherUser, unreadMessageCount } = conversation;

  const prop = { weight: conversation.unreadMessageCount };

  const classes = useStyles(prop);
  let display = true;

  if (unreadMessageCount) {
    const { senderId } = conversation.messages.filter((val) => val.unread)[0];
    display = senderId === userId;
  }

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

      {!display && unreadMessageCount > 0 ? (
        <Box>
          <Badge
            badgeContent={unreadMessageCount}
            className={classes.messages}
            color="primary"
          ></Badge>
        </Box>
      ) : null}
    </Box>
  );
};

const mapStateToProps = (state) => {
  return { userId: state.user.id };
};

export default connect(mapStateToProps)(ChatContent);
