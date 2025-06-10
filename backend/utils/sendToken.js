// Save the Token into Cookie
const sendtoken = (statusCode, res, token, userData) => {
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.status(statusCode).cookie("token", token, options).json({
    message: "login is successfuly",
    success: true,
    userData: userData,
  });
};

module.exports = sendtoken;
