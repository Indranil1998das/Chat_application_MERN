const ex = require("express");
const routes = ex.Router();
const { isAuthenticated } = require("../middleware/auth");
const {
  getConverstionList,
  findConverstion,
  sendMessage,
  getMessage,
  getLastMessage,
  getUploadUrlForFiles,
  sendMessageToAi,
  addNotification,
  getNotification,
  clearNotification,
} = require("../controllers/messageControllers");
//Message Routes
routes.route("/converstion-list").get(isAuthenticated, getConverstionList);
routes.route("/find/conversation").get(isAuthenticated, findConverstion);
routes.route("/message/send/:id").post(isAuthenticated, sendMessage);
routes.route("/message/:id").get(isAuthenticated, getMessage);
routes.route("/file/upload-url").get(isAuthenticated, getUploadUrlForFiles);
routes.route("/last/messages").get(isAuthenticated, getLastMessage);
routes.route("/send/message/ai").post(isAuthenticated, sendMessageToAi);
routes.route("/notification/add").post(isAuthenticated, addNotification);
routes.route("/notification").get(isAuthenticated, getNotification);
routes.route("/notification/clear").post(isAuthenticated, clearNotification);

module.exports = routes;
