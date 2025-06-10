const mongoose = require("mongoose");
const notificationModel = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userInfo",
    required: true,
  },
  notificationList: [
    {
      type: Object,
    },
  ],
});

module.exports = mongoose.model("notification", notificationModel);
