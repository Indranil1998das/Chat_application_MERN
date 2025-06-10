const mongoose = require("mongoose");
const requestFriendsModel = new mongoose.Schema({
  requestSenderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userInfo",
    required: true,
  },
  requestsSend: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userInfo",
    },
  ],
});

module.exports = mongoose.model("requestInfo", requestFriendsModel);
