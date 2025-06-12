const userModel = require("../models/userModel");
const conversationModel = require("../models/conversationModel");
const requestFriendsModel = require("../models/requestFriendsModel");
const blockListModel = require("../models/blockListModel");
const notificationModel = require("../models/notification");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  putObjectToS3,
  getObjectURLfromS3,
  deleteObjectFromS3,
} = require("../utils/AWS");
const { isStrongPassword } = require("validator");
const sendtoken = require("../utils/sendToken");
const ErrorThrow = require("../utils/ErrorThrow");
const crypto = require("crypto");
const SendEmail = require("../utils/SandEmail");
exports.signup = async (req, res, next) => {
  try {
    const {
      fullName,
      userEmail,
      password,
      confirmPassword,
      gender,
      profilePhoto,
    } = req.body;
    if (
      !fullName ||
      !userEmail ||
      !password ||
      !confirmPassword ||
      !gender ||
      !profilePhoto
    ) {
      return next(new ErrorThrow("All fields are required", 400));
    }
    const user = await userModel.findOne({ userEmail });
    if (user) {
      return next(
        new ErrorThrow(
          "Email Id is already present in database so try with anther Email Id .",
          400
        )
      );
    }
    if (password !== confirmPassword) {
      return next(new ErrorThrow("password don't match", 400));
    }
    if (!isStrongPassword(password)) {
      return next(
        new ErrorThrow(
          "Password should contain at least one lowercase letter, one uppercase letter, one number, one special character, and have a minimum length of 8 characters.",
          406
        )
      );
    }
    const hashpassword = await bcrypt.hash(password, 12);
    const match = req.body.profilePhoto.match(/^data:(image\/\w+);base64,/);
    const mimeType = match ? match[1] : "image/jpeg";
    const base64Data = req.body.profilePhoto.replace(
      /^data:image\/\w+;base64,/,
      ""
    );
    const key = `${process.env.UPLOADS_DIR_AVATAR}${req.body.userEmail}`;
    const buffer = Buffer.from(base64Data, "base64");
    await putObjectToS3(mimeType, key, buffer);
    const userInfo = await userModel.create({
      fullName,
      userEmail,
      gender,
      profilePhotoKey: key,
      password: hashpassword,
    });
    await blockListModel.create({
      userId: userInfo._id,
    });
    await notificationModel.create({
      userId: userInfo._id,
    });
    return res.status(201).json({
      message: "user is add in the database",
      success: true,
    });
  } catch (error) {
    return next(new ErrorThrow(error));
  }
};

//Login
exports.login = async (req, res, next) => {
  try {
    const { userEmail, password } = req.body;
    if (!userEmail || !password) {
      return res.status(400).json({
        message: "all fields are required",
        success: false,
      });
    }
    let userData = await userModel
      .findOne({ userEmail: userEmail })
      .select(["+password", "+active"]);
    if (!userData) {
      return next(new ErrorThrow("Incorrect user name or password", 400));
    }
    if (userData.active) {
      return next(
        new ErrorThrow("User is already active in other device.", 403)
      );
    }

    let profilePhotoUrl = await getObjectURLfromS3(userData.profilePhotoKey);
    if (!profilePhotoUrl && userData.profilePhotoKey) {
      profilePhotoUrl = `https://avatar.iran.liara.run/public/${userData.profilePhotoKey}`;
    }
    userData = {
      ...userData._doc,
      profilePhoto: { url: profilePhotoUrl },
    };
    const iscomPassword = await bcrypt.compare(password, userData.password);
    if (!iscomPassword) {
      return next(new ErrorThrow("Incorrect user Name or password", 400));
    }

    const token = jwt.sign(
      { userId: userData._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );
    sendtoken(200, res, token, userData);
  } catch (error) {
    return next(new ErrorThrow(error));
  }
};

//Logout
exports.logout = async (req, res, next) => {
  try {
    res
      .status(200)
      .cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      })
      .json({
        success: true,
        message: "logout successfully",
      });
  } catch (error) {
    return next(new ErrorThrow(error));
  }
};
//Logged user data get
exports.getLoggedUser = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next(new ErrorThrow("Not logged in.", 401));
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const id = decode.userId;
    let data = await userModel.findById(id);
    let profilePhotoUrl = await getObjectURLfromS3(data.profilePhotoKey);
    data = { ...data._doc, profilePhoto: { url: profilePhotoUrl } };
    if (!data) {
      return res.status(200).json({
        success: true,
        data: null,
        authentication: false,
      });
    }
    return res.status(200).json({
      success: true,
      data,
      authentication: true,
    });
  } catch (error) {
    try {
      const decode = jwt.decode(token);
      const userInfo = await userModel
        .findById(decode.userId)
        .select("+active");
      userInfo.active = false;
      await userInfo.save();
    } catch (err) {
      return next(new ErrorThrow("Token is not valid."));
    }

    return next(new ErrorThrow("Session expired."));
  }
};

//Change password
exports.changePassword = async (req, res, next) => {
  try {
    const userId = req.id;
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (!currentPassword || !newPassword || !confirmPassword) {
      return next(new ErrorThrow("All fields are required", 400));
    }
    const data = await userModel.findById(userId).select("+password");
    const iscomPassword = await bcrypt.compare(currentPassword, data.password);
    if (!iscomPassword) {
      return next(new ErrorThrow("Incorrect Old Password", 400));
    }
    if (newPassword !== confirmPassword) {
      return next(new ErrorThrow("password don't match", 400));
    }

    let password = await bcrypt.hash(newPassword, 12);
    data.password = password;
    await data.save();
    return res.status(200).json({
      message: "password is changed successfully",
    });
  } catch (error) {
    return next(new ErrorThrow(error));
  }
};

// Change user profile
exports.changeUserProfile = async (req, res, next) => {
  try {
    const userId = req.id;
    const { changePhoto } = req.body;
    let data = await userModel.findById(userId);
    if (!data) {
      return next(new ErrorThrow("User is not axist in database", 404));
    }
    if (!changePhoto) {
      return next(new ErrorThrow("Please provide a photo to change", 400));
    }
    const response = await deleteObjectFromS3(data.profilePhotoKey);
    if (response.$metadata.httpStatusCode !== 204) {
      return next(new ErrorThrow("Failed to delete old photo", 500));
    }
    const match = changePhoto.match(/^data:(image\/\w+);base64,/);
    const mimeType = match ? match[1] : "image/jpeg";
    const base64Data = changePhoto.replace(/^data:image\/\w+;base64,/, "");
    const key = `${process.env.UPLOADS_DIR_AVATAR}${data.userEmail}`;
    const buffer = Buffer.from(base64Data, "base64");
    await putObjectToS3(mimeType, key, buffer);
    data.profilePhotoKey = key;
    await data.save();
    let profilePhotoUrl = await getObjectURLfromS3(data.profilePhotoKey);
    if (!profilePhotoUrl && data.profilePhotoKey) {
      profilePhotoUrl = `https://avatar.iran.liara.run/public/${data.profilePhotoKey}`;
      data = { ...data._doc, profilePhoto: { url: profilePhotoUrl } };
    } else {
      data = { ...data._doc, profilePhoto: { url: profilePhotoUrl } };
    }
    return res.status(200).json({
      message: "Profile photo updated successfully",
      data,
    });
  } catch (error) {
    return next(new ErrorThrow(error));
  }
};
//Forgot password
exports.forgotPassWord = async (req, res, next) => {
  try {
    const { userEmail } = req.params;
    const data = await userModel.findOne({ userEmail: userEmail });
    if (!data) {
      return next(new ErrorThrow("User is not axist in database"));
    }
    const token = crypto.randomBytes(20).toString("hex");
    const resetToken = crypto.createHash("sha256").update(token).digest("hex");
    data.resetPasswordToken = resetToken;
    data.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
    await data.save();
    const resetURL = ` http://localhost:5173/reset/password/${token}`;
    const message = `If you want to change your old password then go with below url:---- \n\n${resetURL}`;
    try {
      await SendEmail(data.userEmail, message);
      res.status(200).json({
        success: true,
        message: "send a message in your gmail account",
      });
    } catch (error) {
      data.resetPasswordToken = undefined;
      data.resetPasswordExpire = undefined;
      await data.save();
      return next(new ErrorThrow(error));
    }
  } catch (error) {
    return next(new ErrorThrow(error));
  }
};

//Reset password
exports.resetPassword = async (req, res, next) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    let token = req.params.token;
    if (newPassword !== confirmPassword) {
      return next(new ErrorThrow("password don't match", 400));
    }
    token = crypto.createHash("sha256").update(token).digest("hex");
    const data = await userModel
      .findOne({ resetPasswordToken: token })
      .select("+password");
    if (!data) {
      return next(ErrorThrow("user is not found", 404));
    }

    const password = await bcrypt.hash(newPassword, 12);
    data.password = password;
    data.resetPasswordExpire = undefined;
    data.resetPasswordToken = undefined;
    await data.save();
    return res.status(200).json({
      success: true,
      message: "password is change",
    });
  } catch (error) {
    return next(new ErrorThrow(error));
  }
};

//Search other user info
exports.searchForSendRequest = async (req, res, next) => {
  try {
    const { name } = req.query;
    const id = req.id;
    const blockInfo = await blockListModel.findOne({ userId: id });
    let allUsers = [];
    let allUserWithPhotoUrl = [];
    if (!name) {
      return res.status(200).json({
        allUserWithPhotoUrl,
      });
    }
    allUsers = await userModel.find().select(["-friendList", "-socketId"]);
    allUsers = allUsers.filter(
      (data) =>
        data._id.toString() !== id.toString() &&
        data.fullName.toLowerCase().includes(name.toLowerCase()) &&
        !blockInfo.blockUsers.includes(data._id)
    );

    for (const user of allUsers) {
      let profilePhotoUrl = await getObjectURLfromS3(user.profilePhotoKey);
      if (!profilePhotoUrl && user.profilePhotoKey) {
        profilePhotoUrl = `https://avatar.iran.liara.run/public/${user.profilePhotoKey}`;
      }
      allUserWithPhotoUrl.push({
        ...user._doc,
        profilePhoto: { url: profilePhotoUrl },
      });
    }
    return res.status(200).json({
      allUserWithPhotoUrl,
    });
  } catch (error) {
    return next(new ErrorThrow(error));
  }
};

// request for the conversation start
exports.requestForFriend = async (req, res, next) => {
  try {
    const senderId = req.id;
    const { receiverId } = req.params;
    const senderInfo = await userModel.findById(senderId).select("+friendList");
    if (!senderId || !receiverId) {
      return next(new ErrorThrow("Invalid sender or receiver Id.", 400));
    }

    if (senderId === receiverId) {
      return next(
        new ErrorThrow(
          "This User id is not accepted because This is Your user Id.",
          406
        )
      );
    }
    if (
      senderInfo.friendList.some(
        (id) => id.toString() === receiverId.toString()
      )
    ) {
      return next(new ErrorThrow("User is already in your friend list.", 406));
    }

    let reqData = await requestFriendsModel.findOne({
      requestSenderId: senderId,
    });
    if (!reqData) {
      reqData = await requestFriendsModel.create({ requestSenderId: senderId });
    } else if (
      reqData.requestsSend.some((i) => i.toString() === receiverId.toString())
    ) {
      return next(new ErrorThrow("Friend request already sent.", 406));
    }
    reqData.requestsSend.push(receiverId);
    await reqData.save();
    res.status(200).json({
      message: "successfully send your request.",
      data: reqData.requestsSend,
    });
  } catch (error) {
    return next(new ErrorThrow(error));
  }
};

exports.cancelFriendRequest = async (req, res, next) => {
  try {
    const Userid = req.id;
    const { id } = req.params;
    const reqData = await requestFriendsModel.findOne({
      requestSenderId: Userid,
    });
    const data = reqData.requestsSend.filter((i) => i.toString() !== id);
    reqData.requestsSend = data;
    await reqData.save();
    return res.status(200).json({
      updatedReqData: reqData.requestsSend,
    });
  } catch (error) {
    return next(new ErrorThrow(error));
  }
};

// user all sending request
exports.getRequestSend = async (req, res, next) => {
  try {
    const id = req.id;
    let data = await requestFriendsModel.findOne({ requestSenderId: id });
    if (data) {
      data = data.requestsSend;
    } else {
      data = [];
    }
    return res.status(200).json({
      requests: data,
    });
  } catch (error) {
    return next(new ErrorThrow(error));
  }
};
// get request all
exports.getRequestReceived = async (req, res, next) => {
  try {
    const id = req.id;
    let data = await requestFriendsModel
      .find({ requestsSend: id })
      .select("-requestsSend");
    let request = [];
    if (data.length !== 0) {
      for (const item of data) {
        let senerInfo = await userModel
          .findById(item.requestSenderId)
          .select("+friendList")
          .populate("friendList");
        if (senerInfo) {
          const senderPhotoUrl = await getObjectURLfromS3(
            senerInfo.profilePhotoKey
          );
          if (!senderPhotoUrl && senerInfo.profilePhotoKey) {
            senerInfo = {
              ...senerInfo._doc,
              profilePhoto: {
                url: `https://avatar.iran.liara.run/public/${senerInfo.profilePhotoKey}`,
              },
            };
          } else {
            senerInfo = {
              ...senerInfo._doc,
              profilePhoto: { url: senderPhotoUrl },
            };
          }
          request = [
            ...request,
            {
              _id: item._id,
              senderInfo: senerInfo,
            },
          ];
        }
      }
    }
    res.status(200).json({
      requestedDatas: request,
    });
  } catch (error) {
    return next(new ErrorThrow(error));
  }
};

// request status change
exports.changeStatusRequest = async (req, res, next) => {
  try {
    const { status } = req.query;
    const { reqId } = req.query;
    const id = req.id;
    let requestInfo = await requestFriendsModel.findById(reqId);
    const receiverId = requestInfo.requestsSend.find(
      (i) => i.toString() === id
    );
    if (!receiverId) {
      return next(new ErrorThrow("not found", 400));
    }

    let senderInfo = await userModel
      .findById(requestInfo.requestSenderId)
      .select("+friendList");
    if (status === "accept") {
      let receiverInfo = await userModel
        .findById(receiverId)
        .select("+friendList");
      senderInfo.friendList.push(receiverInfo._id);
      receiverInfo.friendList.push(senderInfo._id);
      await senderInfo.save();
      await receiverInfo.save();
      let ConversationData = await conversationModel.findOne({
        participants: { $all: [senderInfo._id, receiverInfo._id] },
      });
      if (!ConversationData) {
        ConversationData = await conversationModel.create({
          participants: [senderInfo._id, receiverInfo._id],
        });
      }
      requestInfo.requestsSend.pull(id);
      await requestInfo.save();
      const senderPhotoUrl = await getObjectURLfromS3(
        senderInfo.profilePhotoKey
      );
      if (!senderPhotoUrl && senderInfo.profilePhotoKey) {
        senderInfo = {
          ...senderInfo._doc,
          profilePhoto: {
            url: `https://avatar.iran.liara.run/public/${senderInfo.profilePhotoKey}`,
          },
        };
      } else {
        senderInfo = {
          ...senderInfo._doc,
          profilePhoto: { url: senderPhotoUrl },
        };
      }
      return res.status(200).json({
        message: "successfully accepted",
        senderInfo: senderInfo,
        conversationInfo: {
          id: ConversationData._id,
          createdAt: ConversationData.createdAt,
          messageLength: ConversationData.messageOrFiles.length,
        },
      });
    } else if (status === "reject") {
      requestInfo.requestsSend.pull(id);
      await requestInfo.save();
      return res.status(200).json({
        message: "successfully rejected",
        senderInfo: senderInfo,
      });
    }
  } catch (error) {
    return next(new ErrorThrow(error));
  }
};

// unfriend
exports.unFriend = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (userId.length === 0) {
      return next(new ErrorThrow("please provied user id", 406));
    }
    const id = req.id;
    let data = await userModel.findById(id).select("+friendList");
    let check = data.friendList.find((i) => i.toString() === userId);
    if (!check) {
      return next(new ErrorThrow("this user not exist", 404));
    }
    const userInfo = await userModel.findById(userId).select("friendList");
    data.friendList = data.friendList.filter((i) => i.toString() !== userId);
    userInfo.friendList = userInfo.friendList.filter(
      (i) => i.toString() !== id
    );
    await data.save();
    await userInfo.save();
    res.status(200).json({
      message: "unfriend succussfully",
      recentlyUnfriendId: userId,
      updatedFriendList: data.friendList,
    });
  } catch (error) {
    return next(new ErrorThrow(error));
  }
};

// Search for friend list
exports.searchForFriendList = async (req, res, next) => {
  try {
    const id = req.id;
    const { name } = req.query;
    let data = await userModel
      .findById(id)
      .select("+friendList")
      .populate("friendList");
    let result = [];
    if (!data.friendList.length !== 0) {
      result = data.friendList.filter((i) =>
        i.fullName.toLowerCase().includes(name.toLowerCase())
      );
    }
    res.status(200).json({
      searchResult: result,
    });
  } catch (error) {
    return next(new ErrorThrow(error));
  }
};
// get friend list with full Infomation
exports.getFriendList = async (req, res, next) => {
  try {
    const id = req.id;
    let data = await userModel
      .findById(id)
      .select(["+friendList", "-socketId"])
      .populate("friendList");
    if (!data) {
      return next(new ErrorThrow("User is not axist in database", 404));
    }
    let friendListWithPhotoUrl = [];
    for (const user of data.friendList) {
      let profilePhotoUrl = await getObjectURLfromS3(user.profilePhotoKey);
      if (!profilePhotoUrl && user.profilePhotoKey) {
        profilePhotoUrl = `https://avatar.iran.liara.run/public/${user.profilePhotoKey}`;
        friendListWithPhotoUrl.push({
          ...user._doc,
          profilePhoto: { url: profilePhotoUrl },
        });
      } else {
        friendListWithPhotoUrl.push({
          ...user._doc,
          profilePhoto: { url: profilePhotoUrl },
        });
      }
    }
    res.status(200).json({
      friendListWithPhotoUrl,
    });
  } catch (error) {
    return next(new ErrorThrow(error));
  }
};

// get  friend List only Ids
exports.getFriendListOnlyIds = async (req, res, next) => {
  try {
    const id = req.id;
    let data = await userModel.findById(id).select("+friendList");
    res.status(200).json({
      friendList: data.friendList,
    });
  } catch (error) {
    return next(new ErrorThrow(error));
  }
};

// Add BlockList
exports.blockListadd = async (req, res, next) => {
  try {
    const { block_userId } = req.params;
    const id = req.id;
    const userInfo = await userModel.findById(id).select("+friendList");
    const blockUserInfo = await userModel
      .findById(block_userId)
      .select("+friendList");
    if (!blockUserInfo) {
      return next(new ErrorThrow("this user is not present in database.", 404));
    }
    let blocklistInfo = await blockListModel.findOne({ userId: id });
    if (!blocklistInfo) {
      return next(
        new ErrorThrow(
          "this user's block List is not present in database.",
          404
        )
      );
    } else {
      const checkuser = blocklistInfo.blockUsers.find(
        (i) => i.toString() === block_userId
      );
      if (checkuser) {
        return next(new ErrorThrow("already present in block List", 406));
      }
      blocklistInfo.blockUsers.push(block_userId);
      await blocklistInfo.save();
    }
    userInfo.friendList = userInfo.friendList.filter(
      (i) => i.toString() !== block_userId
    );

    blockUserInfo.friendList = blockUserInfo.friendList.filter(
      (i) => i.toString() !== id
    );

    await blockUserInfo.save();
    await userInfo.save();
    res.status(200).json({
      message: "successfully add into your block list",
      BlockUserInfo: blockUserInfo,
    });
  } catch (error) {
    return next(new ErrorThrow(error));
  }
};

//Find BlockList
exports.getBlockList = async (req, res, next) => {
  try {
    let data = await blockListModel
      .findOne({ userId: req.id })
      .select(["-_id", "-userId"])
      .populate("blockUsers");
    if (!data) {
      return next(new ErrorThrow("Block List is not exist", 200));
    }
    return res.status(200).json({
      BlockList: data.blockUsers,
      message: "successfully you get the block list",
    });
  } catch (error) {
    return next(new ErrorThrow(error));
  }
};

exports.whoBlockMe = async (req, res, next) => {
  try {
    const id = req.id;
    const blockListInfo = await blockListModel
      .find({ blockUsers: id })
      .populate("userId");
    if (blockListInfo.length === 0) {
      return res.status(200).json({
        blockMeList: [],
      });
    }
    let list = [];
    for (const i of blockListInfo) {
      const blockUserInfo = i.userId;
      list.push({
        _id: blockUserInfo._id,
        fullName: blockUserInfo.fullName,
        userEmail: blockUserInfo.userEmail,
        gender: blockUserInfo.gender,
      });
    }

    return res.status(200).json({
      blockMeList: list,
    });
  } catch (error) {
    return next(new ErrorThrow(error));
  }
};

// Unblock user
exports.unBlockUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const id = req.id;
    const blockuserinfo = await userModel.findById(userId);
    if (!blockuserinfo) {
      return next(new ErrorThrow("this user is not present in database.", 404));
    }
    let data = await blockListModel.findOne({ userId: id });
    data.blockUsers = data.blockUsers.filter((i) => i.toString() !== userId);
    await data.save();
    return res.status(200).json({
      message: "successfully unblock",
      unblockUserId: userId,
    });
  } catch (error) {
    return next(new ErrorThrow(error));
  }
};
