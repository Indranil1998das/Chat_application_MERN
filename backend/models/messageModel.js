const mongoose = require("mongoose");
//Message Model
const messageModel = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userInfo",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userInfo",
      required: true,
    },
    message: {
      type: String,
    },
    fileKey: {
      type: String,
    },
    fileType: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageModel);
