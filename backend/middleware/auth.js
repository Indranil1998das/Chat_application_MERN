const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const ErrorThrow = require("../utils/ErrorThrow");

// Login Authentication
exports.isAuthenticated = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      message: "Not logged in.",
    });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.id = decode.userId;
    next();
  } catch (error) {
    return next(new ErrorThrow("Session expired."));
  }
};
