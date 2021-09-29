const onlineUsers = [];
const getOnlineUserIds = () => onlineUsers.map((val) => val.id);
module.exports = { onlineUsers, getOnlineUserIds };
