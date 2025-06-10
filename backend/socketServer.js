const app = require("./app");
const http = require("http");
const { Server } = require("socket.io");
const userModel = require("./models/userModel");
const notificationModel = require("./models/notification");
const requestFriendsModel = require("./models/requestFriendsModel");
const { getObjectURLfromS3 } = require("./utils/AWS");
const socketServer = http.createServer(app);
const io = new Server(socketServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    pingInterval: 10000,
    pingTimeout: 5000,
  },
});

let onlineUserList = [];
io.on("connection", (socket) => {
  socket.on("addNewConnection", async (userId) => {
    try {
      const userInfo = await userModel
        .findById(userId)
        .select(["+active", "+friendList"])
        .populate("friendList");
      const friendList = userInfo.friendList;
      if (userInfo) {
        if (!userInfo.active) {
          userInfo.active = true;
          await userInfo.save();
        } else {
          if (userInfo.socketId && userInfo.socketId !== socket.id) {
            io.to(userInfo.socketId).emit("userActiveElsewhere", {
              message: "You are active in another tab or device.",
            });
          }
        }
        userInfo.socketId = socket.id;
        await userInfo.save();
        if (userInfo.onlineShow) {
          if (!onlineUserList.includes(userId)) {
            onlineUserList.push(userId);
          }
        }
        let onlineFriendsList = [];
        for (const data of friendList) {
          if (onlineUserList.includes(data._id.toString())) {
            onlineFriendsList.push(data._id.toString());
          }
          const socketId = data.socketId;
          if (userInfo.onlineShow) {
            if (socketId) {
              io.to(socketId).emit("onlineUser", userId);
            }
          }
        }
        io.to(socket.id).emit("AllOnlineUsers", onlineFriendsList);
        console.log(`New Connection  ${socket.id}`);
      }
    } catch (err) {
      console.error(`Error in user Connection ${err}`);
    }
  });

  socket.on("updateProfilePhoto", async (data) => {
    const userInfo = await userModel
      .findById(data.userId)
      .select("+friendList")
      .populate("friendList");
    const userInfoWithOutFriendList = {
      _id: userInfo._id,
      fullName: userInfo.fullName,
      userEmail: userInfo.userEmail,
      profilePhotoKey: userInfo.profilePhotoKey,
      gender: userInfo.gender,
      createdAt: userInfo.createdAt,
      updatedAt: userInfo.updatedAt,
      socketId: userInfo.socketId,
      profilePhoto: data.profilePhoto,
    };
    for (const friend of userInfo.friendList) {
      if (friend.socketId) {
        io.to(friend.socketId).emit("updatedFriendProfile", {
          userInfoWithOutFriendList,
        });
      }
    }
  });

  socket.on("realTimeMessageOrFileSend", async (data) => {
    const receiverInfo = await userModel.findById(data.receiverId);
    if (receiverInfo) {
      if (receiverInfo.socketId) {
        io.to(receiverInfo.socketId).emit("sendMessageOrFileInRealTime", data);
      } else {
        let userNotification = await notificationModel.findOne({
          userId: receiverInfo._id,
        });
        userNotification.notificationList.push(data);
        await userNotification.save();
      }
    }
  });
  socket.on("sendRequest", async (data) => {
    let senderInfo = await userModel.findById(data.senderUserId);
    const senderPhotoUrl = await getObjectURLfromS3(senderInfo.profilePhotoKey);
    senderInfo = { ...senderInfo._doc, profilePhoto: { url: senderPhotoUrl } };
    const receiverUserId = data.receiverUserId;
    const receiverInfo = await userModel.findById(receiverUserId);
    const reqData = await requestFriendsModel.findOne({
      requestSenderId: senderInfo._id,
    });

    if (receiverInfo.socketId) {
      io.to(receiverInfo.socketId).emit("newRequestCame", {
        _id: reqData._id,
        senderInfo: senderInfo,
      });
    }
  });
  socket.on("cancelRequest", async (data) => {
    const userInfo = data.senderUserInfo;
    const receiverUserId = data.receiverUserId;
    const receiverInfo = await userModel.findById(receiverUserId);
    const reqData = await requestFriendsModel.findOne({
      requestSenderId: userInfo._id,
    });
    if (receiverInfo.socketId) {
      io.to(receiverInfo.socketId).emit("cancelRequestFromUser", {
        _id: reqData._id,
      });
    }
  });
  socket.on("logoutUser", async () => {
    try {
      const userInfo = await userModel
        .findOne({ socketId: socket.id })
        .select(["+active", "+friendList"]);
      if (userInfo) {
        userInfo.socketId = null;
        userInfo.active = false;
        await userInfo.save();
        onlineUserList = onlineUserList.filter(
          (i) => i !== userInfo._id.toString()
        );
        let List = await userInfo.populate("friendList");
        const friendList = List.friendList;
        for (const data of friendList) {
          const socketId = data.socketId;
          if (socketId) {
            io.to(socketId).emit("offlineUser", userInfo._id);
          }
        }
        console.log("logout user");
      }
    } catch (error) {
      console.error(`Error in Remove User Info : ${error}`);
    }
  });
  socket.on("friendRequestApproved", async (data) => {
    let receiverInfo = await userModel.findById(data.userId);
    const receiverPhotoUrl = await getObjectURLfromS3(
      receiverInfo.profilePhotoKey
    );
    if (!receiverPhotoUrl) {
      receiverInfo = {
        ...receiverInfo._doc,
        profilePhoto: {
          url: `https://avatar.iran.liara.run/public/${receiverInfo.profilePhotoKey}`,
        },
      };
    } else {
      receiverInfo = {
        ...receiverInfo._doc,
        profilePhoto: { url: receiverPhotoUrl },
      };
    }
    const senderId = data.senderId;
    const senderInfo = await userModel.findById(senderId).select("+friendList");
    if (senderInfo.socketId) {
      io.to(senderInfo.socketId).emit("onlineUser", data.userId);
      io.to(receiverInfo.socketId).emit("onlineUser", senderId);
      io.to(senderInfo.socketId).emit("ApprovedRequest", {
        updatedfriendList: senderInfo.friendList,
        conversationInfoWithOtherUserInfo: {
          userInfo: receiverInfo,
          conversationId: data.conversationId,
          createdAt: data.createdAt,
          messageLength: data.messageLength,
        },
      });
    }
    receiverInfo = await userModel
      .findById(receiverInfo._id)
      .select("+friendList");
    io.to(receiverInfo.socketId).emit(
      "updateFriendList",
      receiverInfo.friendList
    );
  });

  socket.on("friendRequestRejected", async (data) => {
    const userId = data.userId;
    const senderId = data.senderId;
    const senderInfo = await userModel.findById(senderId);
    if (senderInfo.socketId) {
      io.to(senderInfo.socketId).emit("RejectedRequest", userId);
    }
  });

  socket.on("unfriendUser", async (data) => {
    const recentUnfriendUserInfo = await userModel
      .findById(data.lastUnfriendedUserId)
      .select("+friendList");
    const userInfo = await userModel.findById(data.userId);
    if (recentUnfriendUserInfo.socketId) {
      io.to(recentUnfriendUserInfo.socketId).emit(
        "updateFriendList",
        recentUnfriendUserInfo.friendList
      );
      io.to(recentUnfriendUserInfo.socketId).emit("offlineUser", data.userId);
    }
    if (userInfo.socketId) {
      io.to(userInfo.socketId).emit("offlineUser", data.recentUnfriendId);
    }
  });

  socket.on("recentBlockUser", async (data) => {
    const recentBlockUserInfo = await userModel
      .findById(data.lastBlockedUserId)
      .select("+friendList");
    const userInfo = await userModel
      .findById(data.userId)
      .select("+friendList");
    if (recentBlockUserInfo.socketId) {
      io.to(recentBlockUserInfo.socketId).emit("recentlyBlockYou", {
        _id: userInfo._id,
        fullName: userInfo.fullName,
        userEmail: userInfo.userEmail,
        gender: userInfo.gender,
        profilePhoto: {
          url: null,
        },
        createdAt: userInfo.createdAt,
        updatedAt: userInfo.updatedAt,
      });
      io.to(recentBlockUserInfo.socketId).emit(
        "updateFriendList",
        recentBlockUserInfo.friendList
      );
      io.to(recentBlockUserInfo.socketId).emit("offlineUser", data.userId);
    }
    if (userInfo.socketId) {
      io.to(userInfo.socketId).emit("updateFriendList", userInfo.friendList);
      io.to(userInfo.socketId).emit("offlineUser", data.lastBlockedUserId);
    }
  });

  socket.on("activeUser", async (data) => {
    const userInfo = await userModel
      .findById(data.userId)
      .select("+friendList");
    if (userInfo) {
      userInfo.onlineShow = true;
      await userInfo.save();
      onlineUserList.push(userInfo._id.toString());
      let List = await userInfo.populate("friendList");
      const friendList = List.friendList;
      for (const data of friendList) {
        const socketId = data.socketId;
        if (socketId) {
          io.to(socketId).emit("onlineUser", userInfo._id);
        }
      }
    }
  });
  socket.on("deActiveUser", async (data) => {
    const userInfo = await userModel
      .findById(data.userId)
      .select("+friendList");
    if (userInfo) {
      userInfo.onlineShow = false;
      await userInfo.save();
      onlineUserList = onlineUserList.filter(
        (i) => i !== userInfo._id.toString()
      );
      let List = await userInfo.populate("friendList");
      const friendList = List.friendList;
      for (const data of friendList) {
        const socketId = data.socketId;
        if (socketId) {
          io.to(socketId).emit("offlineUser", userInfo._id);
        }
      }
    }
  });

  socket.on("recentUnBlockUser", async (data) => {
    const recentUnBlockUserInfo = await userModel.findById(
      data.lastUnblockedUserId
    );
    const userInfo = await userModel.findById(data.userId).select("-socketId");
    if (recentUnBlockUserInfo.socketId) {
      io.to(recentUnBlockUserInfo.socketId).emit(
        "recentlyUnBlockYou",
        userInfo
      );
    }
  });

  socket.on("disconnect", async () => {
    const userInfo = await userModel
      .findOne({ socketId: socket.id })
      .select(["+active", "+friendList"]);
    if (userInfo) {
      userInfo.socketId = null;
      userInfo.active = false;
      await userInfo.save();
      onlineUserList = onlineUserList.filter(
        (i) => i !== userInfo._id.toString()
      );
      let List = await userInfo.populate("friendList");
      const friendList = List.friendList;
      for (const data of friendList) {
        const socketId = data.socketId;
        if (socketId) {
          io.to(socketId).emit("offlineUser", userInfo._id);
        }
      }
    }
    console.log("disconnect", socket.id);
  });
});

module.exports = { socketServer };
