const {
  signup,
  login,
  logout,
  searchForSendRequest,
  searchForFriendList,
  getLoggedUser,
  changePassword,
  changeUserProfile,
  blockListadd,
  getBlockList,
  unBlockUser,
  whoBlockMe,
  forgotPassWord,
  resetPassword,
  requestForFriend,
  getRequestReceived,
  cancelFriendRequest,
  changeStatusRequest,
  unFriend,
  getFriendList,
  getFriendListOnlyIds,
  getRequestSend,
} = require("../controllers/userControllers");
const { isAuthenticated } = require("../middleware/auth");
const ex = require("express");
const router = ex.Router();
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/search/users").get(isAuthenticated, searchForSendRequest);
router.route("/search/friends").get(isAuthenticated, searchForFriendList);
router.route("/logout").put(isAuthenticated, logout);
router.route("/logged/user").get(getLoggedUser);
router.route("/password/change").put(isAuthenticated, changePassword);
router.route("/profile/photo/change").put(isAuthenticated, changeUserProfile);
router.route("/password/forgot").get(isAuthenticated, forgotPassWord);
router.route("/reset/:token").put(resetPassword);
router
  .route("/block/user/add/:block_userId")
  .post(isAuthenticated, blockListadd);
router.route("/block-list").get(isAuthenticated, getBlockList);
router.route("/who/block-me").get(isAuthenticated, whoBlockMe);
router.route("/unblock/:userId").put(isAuthenticated, unBlockUser);
router
  .route("/send/request/:receiverId")
  .post(isAuthenticated, requestForFriend);
router.route("/requests/send").get(isAuthenticated, getRequestSend);
router.route("/requests").get(isAuthenticated, getRequestReceived);
router.route("/cancel/request/:id").put(isAuthenticated, cancelFriendRequest);
router
  .route("/request/status/change")
  .put(isAuthenticated, changeStatusRequest);
router.route("/unfriend/:userId").put(isAuthenticated, unFriend);
router.route("/friend-list").get(isAuthenticated, getFriendList);
router.route("/friend-list/ids").get(isAuthenticated, getFriendListOnlyIds);
module.exports = router;
