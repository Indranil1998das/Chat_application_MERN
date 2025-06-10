const mongoose = require("mongoose");
// Blocklist Model
const blockListModle = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userInfo",
    required: true,
  },
  blockUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userInfo",
    },
  ],
});

module.exports = mongoose.model("BlockList", blockListModle);
