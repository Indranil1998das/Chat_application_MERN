const mongoose = require("mongoose");
//Conversation Model
const conversationModel = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userInfo",
      },
    ],
    messageOrFiles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Conversation", conversationModel);
