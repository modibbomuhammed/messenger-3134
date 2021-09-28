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
  // previewText: {
  //   fontSize: 12,
  //   color: "#9CADC8",
  //   letterSpacing: -0.17,
  // },
  previewText: (prop) => ({
    fontSize: 12,
    // color: prop.weight ? "#000000" : "#9CADC8",
    letterSpacing: -0.17,
    fontWeight: prop.weight ? 700 : 100,
  }),
  messages: {
    right: "30px",
    top: "10px",
  },
}));

const ChatContent = (props) => {
  const { conversation, activeConvo } = props;
  const { latestMessageText, otherUser, unreadMessagesCount } = conversation;

  const prop = { weight: conversation.unreadMessagesCount };

  const classes = useStyles(prop);

  const display = activeConvo === otherUser.username;
  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography
          className={classes.previewText}
          style={{ color: unreadMessagesCount ? "#000000" : "#9CADC8" }}
        >
          {latestMessageText}
        </Typography>
      </Box>

      {!display && unreadMessagesCount > 0 ? (
        <Box>
          <Badge
            badgeContent={unreadMessagesCount}
            className={classes.messages}
            color="primary"
          ></Badge>
        </Box>
      ) : null}
    </Box>
  );
};

const mapStateToProps = (state) => {
  return { activeConvo: state.activeConversation };
};

export default connect(mapStateToProps)(ChatContent);
