const conversationModel = require("../models/conversationModel");
const messageModel = require("../models/messageModel");
const notificationModel = require("../models/notification");
const userModel = require("../models/userModel");
const ErrorThrow = require("../utils/ErrorThrow");
const aiMessage = require("../utils/AI");
const { getObjectURLfromS3, putObjectURLfromS3 } = require("../utils/AWS");
const blockListModel = require("../models/blockListModel");
exports.sendMessage = async (req, res, next) => {
  try {
    const sendId = req.id;
    const receiverId = req.params.id;
    const senderInfo = await userModel.findById(sendId).select("+friendList");
    const receiverInfo = await userModel
      .findById(receiverId)
      .select("+friendList");
    if (
      !senderInfo.friendList.includes(receiverId) ||
      !receiverInfo.friendList.includes(sendId)
    ) {
      return next(
        new ErrorThrow(
          "You cannot send a message because this user is not in your friends list.",
          406
        )
      );
    }
    let { message, fileKey, fileType } = req.body;
    if (!message && !fileKey) {
      return next(
        new ErrorThrow(
          "Only one field (text, image, or video) should be filled."
        )
      );
    }
    if (fileKey) {
      if (!fileType) {
        return next(new ErrorThrow("File Type must be Provied."));
      }
    }
    let ConversationData = await conversationModel.findOne({
      participants: { $all: [sendId, receiverId] },
    });
    if (!ConversationData) {
      return next(new ErrorThrow("Coversation is not present.", 404));
    }
    const newMessage = await messageModel.create({
      senderId: sendId,
      receiverId: receiverId,
      message: message,
      fileKey: fileKey,
      fileType: fileType,
    });
    await ConversationData.updateOne({
      $push: { messageOrFiles: newMessage._id },
    });

    let url = null;
    if (fileKey) {
      url = await getObjectURLfromS3(fileKey);
      if (!url) {
        return next(new ErrorThrow("File not found.", 404));
      }
    }
    return res.status(201).json({
      success: true,
      messageInfoForSender: {
        _id: newMessage._id,
        senderId: newMessage.senderId,
        receiverId: newMessage.receiverId,
        message: message,
        fileKey: fileKey,
        fileType: fileType,
        fileUrl: url,
        createdAt: new Date(),
      },
      encryptedMessage: newMessage,
      message: "Message sent successfully.",
    });
  } catch (error) {
    return next(new ErrorThrow(error.message));
  }
};
exports.getUploadUrlForFiles = async (req, res, next) => {
  try {
    const { fileType, fileName } = req.query;
    if (!fileType || !fileName) {
      return next(new ErrorThrow("File type and file name are required."));
    }
    const ContentType = fileType === "image" ? "image/jpeg" : "video/mp4";
    const returnData = await putObjectURLfromS3(fileName, ContentType);
    if (!returnData.url) {
      return next(new ErrorThrow("Failed to generate upload URL."));
    }
    return res.status(200).json({
      uploadUrl: returnData.url,
      key: returnData.key,
      message: "Upload URL generated successfully.",
    });
  } catch (error) {
    return next(new ErrorThrow(error.message));
  }
};
exports.getConverstionList = async (req, res, next) => {
  try {
    const id = req.id;
    let conversations = await conversationModel
      .find({ participants: id })
      .select(["-privateKey", "-publicKey", "-imageUrl", "-videoUrl"]);
    const blockInfo = await blockListModel
      .find({ blockUsers: id })
      .select(["-_id", "-blockUsers"]);
    const conversationList = [];
    for (let data of conversations) {
      const participantsInfo = await data.populate("participants");
      let userInfo = participantsInfo.participants.find(
        (i) => i._id.toString() !== id
      );
      if (
        blockInfo.some((i) => i.userId.toString() === userInfo._id.toString())
      ) {
        const url = await getObjectURLfromS3("default-image.png");
        userInfo = {
          _id: userInfo._id,
          fullName: userInfo.fullName,
          userEmail: userInfo.userEmail,
          profilePhoto: {
            url: url,
          },
          gender: userInfo.gender,
          createdAt: userInfo.createdAt,
          updatedAt: userInfo.updatedAt,
        };
      } else {
        const url = await getObjectURLfromS3(userInfo.profilePhotoKey);
        if (!url) {
          userInfo = {
            ...userInfo._doc,
            profilePhoto: {
              url: `https://avatar.iran.liara.run/public/${user.profilePhotoKey}`,
            },
          };
        } else {
          userInfo = { ...userInfo._doc, profilePhoto: { url: url } };
        }
      }

      conversationList.push({
        userInfo: userInfo,
        conversationId: data._id,
        createdAt: data.createdAt,
        messageLength: data.messageOrFiles.length,
      });
    }
    return res.status(200).json({
      conversationList,
    });
  } catch (error) {
    return next(new ErrorThrow(error.message));
  }
};
exports.findConverstion = async (req, res, next) => {
  try {
    const { panterName } = req.query;
    const userId = req.id;
    const blockInfo = await blockListModel
      .find({ blockUsers: userId })
      .select(["-_id", "-blockUsers"]);
    let result = [];
    const fullConversationInfo = await conversationModel
      .find({ participants: userId })
      .select(["-imageUrl", "-videoUrl"])
      .populate("participants");
    for (const conver of fullConversationInfo) {
      let participantInfo = conver.participants.find(
        (i) => i._id.toString() !== userId
      );
      if (
        participantInfo.fullName
          .toLowerCase()
          .includes(panterName.toLowerCase())
      ) {
        if (
          !blockInfo.some((i) => i.userId.toString() === participantInfo._id)
        ) {
          const url = await getObjectURLfromS3(participantInfo.profilePhotoKey);
          if (!url) {
            participantInfo = {
              ...participantInfo._doc,
              profilePhoto: {
                url: `https://avatar.iran.liara.run/public/${participantInfo.userEmail}`,
              },
            };
            result.push({
              userInfo: participantInfo,
              conversationId: conver._id,
              createdAt: conver.createdAt,
              messageLength: conver.messageOrFiles.length,
            });
          } else {
            participantInfo = {
              ...participantInfo._doc,
              profilePhoto: { url: url },
            };
            result.push({
              userInfo: participantInfo,
              conversationId: conver._id,
              createdAt: conver.createdAt,
              messageLength: conver.messageOrFiles.length,
            });
          }
        } else {
          const url = await getObjectURLfromS3("default-image.png");
          participantInfo = {
            _id: participantInfo._id,
            fullName: participantInfo.fullName,
            userEmail: participantInfo.userEmail,
            profilePhoto: {
              url: url,
            },
            gender: participantInfo.gender,
            createdAt: participantInfo.createdAt,
            updatedAt: participantInfo.updatedAt,
          };
          result.push({
            userInfo: participantInfo,
            conversationId: conver._id,
            createdAt: conver.createdAt,
            messageLength: conver.message.length,
          });
        }
      }
    }
    res.status(200).json({
      searchResult: result,
    });
  } catch (error) {
    return next(new ErrorThrow(error.message));
  }
};

exports.getLastMessage = async (req, res, next) => {
  try {
    const id = req.id;
    const Conversation = await conversationModel.find({ participants: id });
    let lastMessage = [];
    for (const item of Conversation) {
      const populatesItem = await item.populate("messageOrFiles");
      let lastAdd =
        populatesItem.messageOrFiles[populatesItem.messageOrFiles.length - 1];
      let partnerUserId = null;
      if (lastAdd) {
        if (lastAdd.senderId.toString() === id) {
          partnerUserId = lastAdd.receiverId;
        } else {
          partnerUserId = lastAdd.senderId;
        }
        if (lastAdd.message) {
          lastMessage.push({
            id: partnerUserId,
            lastMessage: lastAdd.message,
            fileType: null,
            createdAt: lastAdd.createdAt,
          });
        }
        if (lastAdd.fileKey) {
          lastMessage.push({
            id: partnerUserId,
            lastMessage: "File",
            fileType: lastAdd.fileType,
            createdAt: lastAdd.createdAt,
          });
        }
      }
    }
    res.status(200).json({
      lastMessage: lastMessage,
    });
  } catch (error) {
    return next(new ErrorThrow(error));
  }
};

exports.getMessage = async (req, res, next) => {
  try {
    const senderId = req.params.id;
    const receiverId = req.id;
    const Conversation = await conversationModel
      .findOne({
        participants: { $all: [senderId, receiverId] },
      })
      .populate("messageOrFiles");

    if (!Conversation) {
      return res.status(200).json({ messages: [] });
    }

    let all_messagesOrFiles = [];
    for (const item of Conversation.messageOrFiles) {
      if (item.message) {
        all_messagesOrFiles.push(item);
      }
      if (item.fileKey) {
        const url = await getObjectURLfromS3(item.fileKey);
        const data = { ...item._doc, fileUrl: url };
        all_messagesOrFiles.push(data);
      }
    }
    return res.status(200).json({ messagesOrFiles: all_messagesOrFiles });
  } catch (error) {
    return next(new ErrorThrow(error.message));
  }
};

exports.sendMessageToAi = async (req, res, next) => {
  try {
    const { message } = req.body;
    const reply = await aiMessage(message);
    res.status(200).json({
      name: "Ai",
      message: reply,
    });
  } catch (error) {
    console.log(error);

    return next(new ErrorThrow(error.message));
  }
};

exports.addNotification = async (req, res, next) => {
  try {
    const userId = req.id;
    const { data } = req.body;
    const userNotification = await notificationModel.findOne({
      userId: userId,
    });
    if (!userNotification) {
      return next(new ErrorThrow("Notification not found.", 404));
    }
    userNotification.notificationList.push(data);
    await userNotification.save();
    return res.status(200).json({
      notification: data,
    });
  } catch (error) {
    return next(new ErrorThrow(error.message));
  }
};

exports.getNotification = async (req, res, next) => {
  try {
    const userId = req.id;
    const userNotification = await notificationModel
      .findOne({ userId: userId })
      .select(["-userId", "-_id"]);
    if (!userNotification) {
      return res.status(200).json({ notifications: [] });
    }
    return res.status(200).json({
      notifications: userNotification.notificationList,
    });
  } catch (error) {
    return next(new ErrorThrow(error.message));
  }
};
exports.clearNotification = async (req, res, next) => {
  try {
    const userId = req.id;
    const { senderId } = req.body;
    const userNotification = await notificationModel.findOne({
      userId: userId,
    });
    if (!userNotification) {
      return res.status(404).json({ message: "No notifications found." });
    }
    const updateNotificationList = [];
    for (const noti of userNotification.notificationList) {
      if (noti.senderId.toString() !== senderId.toString()) {
        updateNotificationList.push(noti);
      }
    }
    userNotification.notificationList = updateNotificationList;
    await userNotification.save();
    return res.status(200).json({
      updateNotificationList,
    });
  } catch (error) {
    return next(new ErrorThrow(error.message));
  }
};
