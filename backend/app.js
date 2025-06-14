const ex = require("express");
const app = ex();
const cookieParsar = require("cookie-parser");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const Error = require("./middleware/Error");
const ErrorThrow = require("./utils/ErrorThrow");
const fileUpload = require("express-fileupload");
// Middleware
app.use(ex.json({ limit: "50mb" }));
app.use(cookieParsar());
app.use(fileUpload());
app.use("/api/v1", userRoutes, messageRoutes);
app.use("/", (req, res) => {
  res.send({
    Error: false,
    activeStatus: true,
  });
});
app.use("*", (req, res, next) => {
  return next(
    new ErrorThrow(`Can't found ${req.originalUrl} on our server`, 400)
  );
});
app.use(Error);
module.exports = app;
