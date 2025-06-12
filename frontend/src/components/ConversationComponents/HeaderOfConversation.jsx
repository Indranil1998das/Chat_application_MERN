import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import {
  handleUnfriendAPI,
  handleToClearLastUnfriendedUserId,
} from "../../slices/FriendsSlice";
import {
  handleBlockUserAPI,
  handleUnblockUserAPI,
  handleToClearLastBlockUser,
} from "../../slices/BlockSlice";
import useSocket from "../../context/useContext";
function HeaderOfConversation({
  handleUnselecteUser,
  handleToOpenConversationInfo,
}) {
  console.log("henderOfCo");
  const Dispatch = useDispatch();
  const socket = useSocket();
  const menuRef = React.useRef(null);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { selectedConversation } = useSelector((state) => state.Conversations);
  const {
    blockedUsersInfo,
    lastBlockedUserId,
    lastUnblockedUserId,
    usersWhoBlockedMe,
  } = useSelector((state) => state.Block);
  const { onlineFriendIds, basicFriendList, lastUnfriendedUserId } =
    useSelector((state) => state.Friends);
  const { userDetails } = useSelector((state) => state.User);
  const handleMenuOpen = () => {
    setIsMenuOpen(true);
  };
  const handleToUnFriend = () => {
    Dispatch(handleUnfriendAPI(selectedConversation.userInfo._id));
  };

  const handleToBlock = () => {
    Dispatch(handleBlockUserAPI(selectedConversation.userInfo._id));
  };

  const handleToUnblock = () => {
    Dispatch(handleUnblockUserAPI(selectedConversation.userInfo._id));
  };

  React.useEffect(() => {
    const handleMenuClose = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleMenuClose);
    return () => {
      document.removeEventListener("mousedown", handleMenuClose);
    };
  }, []);
  React.useEffect(() => {
    if (lastUnfriendedUserId) {
      socket?.emit("unfriendUser", {
        lastUnfriendedUserId: lastUnfriendedUserId,
        userId: userDetails._id,
      });
      Dispatch(handleToClearLastUnfriendedUserId());
    }
  }, [lastUnfriendedUserId]);

  React.useEffect(() => {
    if (lastBlockedUserId) {
      socket?.emit("recentBlockUser", {
        lastBlockedUserId: lastBlockedUserId,
        userId: userDetails._id,
      });
    }
    if (lastUnblockedUserId) {
      socket?.emit("recentUnBlockUser", {
        lastUnblockedUserId: lastUnblockedUserId,
        userId: userDetails._id,
      });
    }
    Dispatch(handleToClearLastBlockUser());
  }, [lastBlockedUserId, lastUnblockedUserId]);

  return (
    <div className="w-full p-6 flex justify-between items-center relative bg-white z-50">
      <div className="flex space-x-4 items-center ">
        <button
          className=" p-1 text-2xl cursor-pointer"
          onClick={handleUnselecteUser}
        >
          <MdClose />
        </button>
        <div className="avatar online">
          <div className="w-14 rounded-full">
            <img
              src={`${
                selectedConversation &&
                selectedConversation.userInfo.profilePhoto &&
                selectedConversation.userInfo.profilePhoto.url
              }`}
              alt="avatar"
            />
          </div>
        </div>
        <div>
          <h1 className="font-bold text-xl">
            {selectedConversation && selectedConversation.userInfo.fullName}
          </h1>
          <span className=" text-green-600">
            {basicFriendList.includes(selectedConversation.userInfo._id) &&
              ` ${
                onlineFriendIds.includes(selectedConversation.userInfo._id)
                  ? "Online"
                  : "Offline"
              } `}
          </span>
        </div>
      </div>
      <div
        className="p-2 text-[8vmin] sm:text-[5vmin] hover:bg-green-400 rounded-full duration-500  cursor-pointer"
        onClick={handleMenuOpen}
      >
        <BsThreeDotsVertical />
      </div>
      <div
        className={`absolute top-[70%] right-10 shadow-xl shadow-green-500 p-2 bg-white rounded-md z-50 transition-all duration-300 transform scale-0 opacity-0  ${
          isMenuOpen ? "scale-100 opacity-100" : ""
        }`}
        ref={menuRef}
      >
        <ul className="text-lg  w-full ">
          <li className="w-full">
            <button
              className="m-1  flex items-start w-full hover:text-xl   hover:shadow-xl  p-1  rounded-md duration-500 cursor-pointer"
              onClick={handleToOpenConversationInfo}
            >
              Conversation info
            </button>
          </li>
          {!usersWhoBlockedMe.some(
            (i) => i._id === selectedConversation.userInfo._id
          ) && (
            <>
              <li className=" w-full">
                {!blockedUsersInfo.some(
                  (user) => user._id === selectedConversation.userInfo._id
                ) && (
                  <>
                    {basicFriendList.includes(
                      selectedConversation.userInfo._id
                    ) ? (
                      <button
                        className=" m-1  flex items-start w-full hover:text-xl   hover:shadow-xl  p-1  rounded-md duration-500 cursor-pointer"
                        onClick={handleToUnFriend}
                      >
                        Unfriend
                      </button>
                    ) : (
                      <></>
                    )}
                  </>
                )}
              </li>
              <li className="w-full ">
                {blockedUsersInfo.some(
                  (user) => user._id === selectedConversation.userInfo._id
                ) ? (
                  <button
                    className="m-1  flex items-start w-full hover:text-xl   hover:shadow-xl  p-1  rounded-md duration-500 cursor-pointer"
                    onClick={handleToUnblock}
                  >
                    Unblock
                  </button>
                ) : (
                  <button
                    className="m-1  flex items-start w-full hover:text-xl   hover:shadow-xl  p-1  rounded-md duration-500 cursor-pointer"
                    onClick={handleToBlock}
                  >
                    Block
                  </button>
                )}
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default HeaderOfConversation;
