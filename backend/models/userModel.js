const mongoose = require("mongoose");
const validator = require("validator");
//User Model
const usermodel = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
      unique: true,
      validator: [validator.isEmail, "Please Enter your email id"],
    },
    password: {
      type: String,
      default: "",
      select: false,
    },
    profilePhotoKey: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    friendList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userInfo",
        select: false,
      },
    ],
    active: {
      type: Boolean,
      default: false,
      select: false,
    },
    onlineShow: {
      type: Boolean,
      default: true,
    },
    socketId: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("userInfo", usermodel);
